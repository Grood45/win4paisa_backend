const randomstring = require("randomstring");
const twilio = require("twilio");

// Twilio credentials (replace with your own)
const accountSid = "AC59fcd3f5ddeb4eb738ed75beafce2952";
const authToken = "259b8cd62ea7dd93632ff140ef05e548";
const twilioPhoneNumber = "+917008369373";

const client = new twilio(accountSid, authToken);

const userOTPMap = {}; // In-memory storage for simplicity, use a database in production

// Step 1: Generate and Send OTP
const SendOtp=async(req, res) => {
  const phoneNumber = req.body.phoneNumber;

  // Generate a random 6-digit OTP
  const OTP = randomstring.generate({ length: 6, charset: "numeric" });

  // Store OTP with expiration time (e.g., 5 minutes)
  const expirationTime = Date.now() + 5 * 60 * 1000;
  userOTPMap[phoneNumber] = { OTP, expirationTime };

  try {
    // Send OTP to the user's phone number via Twilio
    await client.messages.create({
      body: `Your OTP is: ${OTP}`,
      from: 7008369373,
      to: phoneNumber,
    });

    res.json({ message: "OTP sent successfully." });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP." });
  }
};