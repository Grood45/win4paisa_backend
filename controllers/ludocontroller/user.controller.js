const User = require("../../models/user.model");
const { GetCurrentTime } = require("../../utils/GetCurrentTime");

async function UserLogin(req, res) {
  const { phone, first_name, last_name } = req.body;
  try {
    // Find the admin by username
    let user = await User.findOne({ phone: phone, user_type: "ludocasino" });
    if (user) {
      let token = GenrateJwtToken(user.phone); // You need to implement this function
      // Send a success response with the token and user data
      return res.status(200).json({
        status: 200,
        success: true,
        user,
        data: { token, username: user.username },
        redirect: "/sports",
        message: "Login successfully",
      });
    } else if (!user) {
      let allUser = await User.countDocuments();
      let payload = {
        first_name,
        last_name,
        username: (first_name || "user") + (+allUser.length || 0) + 1,
        user_id: (first_name || "user") + (+allUser.length || 0) + 1,
        phone: phone,
        referral_code: (first_name || "user") + (+allUser.length || 0) + 1,
        joined_at: GetCurrentTime(),
        updated_at: GetCurrentTime(),
        last_seen: GetCurrentTime(),
      };
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
          message: "Player not resister, Please try again.",
        });
      }
      let user = new User(payload);
      await user.save();
      let token = GenrateJwtToken(phone); // You need to implement this function
      return res.status(200).json({
        status: 200,
        success: true,
        message: "Register succesfully",
        user,
        data: { token, username },
        redirect: "/sports",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    if (error.code == 1111) {
      return res.status(500).json({
        status: 500,
        success: false,
        data: null,
        message: "User with the same Phone already exists.",
      });
    }

    res.status(500).json({
      status: 500,
      success: false,
      data: null,
      message: error.message,
    });
  }
}

const GetSingleUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the market document by ID
    const user = await User.findOne({
      $or: [user_id, username],
      user_type: "ludocasino",
    });

    res.status(200).json({
      status: 200,
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSingleUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the market document by ID

    const payload = req.body;
    const user = await User.findOneAndUpdate(
      { $or: [user_id, username], user_type: "ludocasino" },
      payload,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "User details update successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { UserLogin, GetSingleUser, UpdateSingleUser };
