const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Define an array of valid sports types
const FancyQuestionSchema = new Schema({
  question: {
    type: String,
    required: true,
  },
  match_id: {
    type: String,
    required: true,
  },
  match_name: {
    type: String, // Add the field for the match name
    required: true,
  },
  league_id: {
    type: String,
    required: true,
  },
  league_name: {
    type: String,
  },
  result: {
    type: String,
    enum: ["yes", "no", "pending"],
    default: "pending",
  },
  event_type: {
    type: String,
    default: "sport",
    required: true,
  },
  created_at: {
    type: String,
  },
  market_id: { type: String, default:"" },
  question_id: { type: String, default:"" },
});

// Create the BetHistory model
const FancyQuestionModel = mongoose.model("fancyquestion", FancyQuestionSchema);
module.exports = { FancyQuestionModel };

// 1- get all bet by question.
// 2- filter by all parameter.
// 3- declaire the result manupulate user amount and exposure according to that.
