const mongoose = require("mongoose");

const globalSettingSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  username: { type: String, default: "", required: true },
  language: {
    type: String,
    default: "english",
    required: true,
    enum: ["hin", "eng"],
  },
  music: { type: Boolean, default: false, required: true },
  sound: { type: Boolean, default: false, required: true },
  instruction: { type: String, default: "", required: true },
});

const GlobalSettingLudo = mongoose.model(
  "GlobalSettingLudo",
  globalSettingSchema
);
module.exports = GlobalSettingLudo;
