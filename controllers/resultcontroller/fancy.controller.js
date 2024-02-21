const { default: mongoose } = require("mongoose");
const { FancyQuestionModel } = require("../../models/fancyquestion.model");

const DeclaireFancyBet = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const {
    question,
    match_id,
    league_id,
    question_id,
    market_id,
    answer,
    size,
  } = req.body;
  try {
    const singleQuestion = await FancyQuestionModel.findOne({
      market_id: market_id,
      league_id: league_id,
      match_id: match_id,
      question_id: question_id,
      question: question,
    }).season(season);

    let allBet = await BetModel.find({
      match_id: match_id,
      bet_category: "fancy",
      question: question,
      question_id: question_id,
      market_id: market_id,
    }).session(session);
    // here run a loop to declaire all results
    for (let g = 0; g < allBet.length; g++) {
      const bet = allBet[g];

      if (bet.bet_type == "back" && bet.size < size) {
        // update amount and bet here the user win the the bet.
        bet.result = "win";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount += bet.stake;
      } else if (bet.bet_type == "back" && bet.size <= size) {
        // update amount and bet here the user win the the bet.
        bet.result = "win";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount += bet.stake;
      } else if (bet.bet_type == "lay" && bet.size >= size) {
        // update amount and bet here the user lose the the bet.
        bet.result = "lose";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount -= bet.stake;
      } else if (bet.bet_type == "back" && bet.size > size) {
        // update amount and bet here the user lose the the bet.
        bet.result = "lose";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount -= bet.stake;
      }
      singleQuestion.result = "pending";
      singleQuestion.size = size;
      await user.save().season(season);
      await bet.save().season(season);
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = { DeclaireFancyBet };
