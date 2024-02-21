const { default: axios } = require("axios");
const User = require("../../models/user.model");
const { DecryptPassword } = require("../../utils/DecryptPassword");
const { EncryptPassword } = require("../../utils/EncryptPassword");
const { GenrateJwtToken } = require("../../utils/GenerateJwt");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");
const NotificationModel = require("../../models/notification.model");
const { sendEmail } = require("../../utils/SendOtp");

async function GoogleLogin(req, res) {
  const {
    email,
    first_name,
    last_name,
    otpless_token,
    username,
    password,
    phone,
    type=""
  } = req.body;
console.log(req.body)
  try {
    let user = await User.findOne({
      $or: [{ email: email }, { username: username }],
    });

    
    if (user) {
      if (!username || !password) {
        return res.status(400).json({
          status: 400,
          success: false,
          message: "Email and password are required.",
        });
      } else if (username && password) {
        let isPasswordValid = await DecryptPassword(password, user.password);
        let token = GenrateJwtToken(user.username);
        let existingUserByEmail = await User.findOne({ email: email });
        let existingUserByUsername = await User.findOne({ username: username });
    

    
        if(type=="register" && existingUserByEmail){
          return res.status(400).json({
            succes:400,
          message:"email already register"
          })
        }
        else if(type=="register" && existingUserByUsername){
          return res.status(400).json({
            succes:400,
          message:"username already used"
          })
        }
        else if (!isPasswordValid){
          return res.status(400).json({
            status: 400,
            success: false,
            message: "wrong password",
          });
        }
        return res.status(200).json({
          status: 200,
          success: true,
          user,
          data: { token, username: user.username, otpless_token },
          redirect: "/",
          message: "Login successful",
        });
      }
    } else {
      let allUser = await User.find();
      let hashPassword = await EncryptPassword(password);
      let payload = {
        first_name,
        last_name,
        username,
        user_id: (allUser.length || 0) + (first_name || "user") + "1",
        email,
        phone,
        password: hashPassword,
        referral_code: username,
        joined_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
        last_seen: GetCurrentTime(),
        user_type: "bajivairent",
      };

      // Registering user in external system
      let casinoPlayer = {
        Username: username,
        UserGroup: "a",
        Agent: "suvampandar",
        CompanyKey: process.env.COMPANY_KEY,
        ServerId: "568Win-TEST11",
      };
      let data = await axios.post(
        "https://ex-api-demo-yy.568win.com/web-root/restricted/player/register-player.aspx",
        casinoPlayer
      );

      if (!data) {
        return res.status(500).json({
          status: 500,
          success: false,
          data: null,
          message: "Player registration failed. Please try again.",
        });
      }

      let newUser = new User(payload);
      await newUser.save();

      // Logging new user creation in the system
      let notificationData = {
        user_id: newUser.user_id,
        admin_id: "admin1",
        full_name: `${first_name} ${last_name}`,
        username: newUser.username,
        email: newUser.email,
        amount: 0,
        description: "New user joined.",
        type: "admin",
        title: "New user",
        timestamp: GetCurrentTime(),
        category: "newuser",
      };
      let timestamp = GetCurrentTime();
      payload = { ...notificationData, timestamp };
      let notification = new NotificationModel(payload);
      await notification.save();

      let token = GenrateJwtToken(email);
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Registration successful.",
        user: newUser,
        data: { token, username, otpless_token },
        redirect: "/",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}
// Function to send OTP to a recipient


const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
};

// Function to send OTP to a recipient
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate OTP
    const otp = generateOTP();

    // Save OTP to user's data
    let user = await User.findOneAndUpdate({ email: email }, { otp: otp });
 if(!user){
  return res
  .status(404)
  .json({ status: 200, success: true, message: "User not found." });
 }
    // Send email
    let full_name =user?.username||"user";
    const info = await sendEmail(email, full_name, otp);
    console.log(`Sent OTP to ${email}:`, info);

    res
      .status(200)
      .json({ status: 200, success: true, message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res
      .status(500)
      .json({ status: 500, success: false, message: "Error sending OTP." });
  }
};

// Function to verify OTP and reset password
const verifyOTPAndResetPassword = async (req, res) => {
  const { email, userEnteredOTP, newPassword } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, success: false, message: "User not found." });
    }

    // Compare OTP entered by the user with the OTP saved in the user's data
    if (user.otp == userEnteredOTP) {
      // OTP verification successful, clear OTP from user's data
      let hashPassword = await EncryptPassword(newPassword);
     const user= await User.findOneAndUpdate(
        { email: email },
        { password: hashPassword }
      );

      
      res.status(200).json({
        status: 200,
        success: true,
        message: "Password reset successful.",
      });
    } else {
      res
        .status(400)
        .json({ status: 400, success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error resetting password.",
    });
  }
}
module.exports = {
  sendOTP,
  verifyOTPAndResetPassword,
  GoogleLogin,
};
