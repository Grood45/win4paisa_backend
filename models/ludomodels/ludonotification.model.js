const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  username: {
    type: String,
    required: true,

  },
  user_id: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },

  email: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["user", "admin"],
  },
  category: {
    type: String,
    enum: ["withdraw", "deposit", "newuser", "promotion"],
  },
  title: {
    type: String,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const NotificationLudo = mongoose.model("NotificationLudo", notificationSchema);

module.exports = NotificationLudo;
