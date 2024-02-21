const { default: mongoose } = require("mongoose");
const { BetModel } = require("../../models/bet.model");
const User = require("../../models/user.model");

const DelaireTossResult = async (req, res) => {
  const { team, match_id, league_id } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let allBet = await BetModel.find({
      match_id,
      bet_category: "toss",
    }).session(session);

    for (let g = 0; g < allBet.length; g++) {
      const bet = allBet[g];
      //get the user of perticular bet.
      let user = await User.findOne({
        username: bet.username,
        user_id: bet.user_id,
      }).session(session);

      if (bet.runner_name == team && bet.bet_type == "back") {
        // update amount and bet here the user win the the bet.
        bet.result = "win";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount += bet.stake;
      } else if (bet.runner_name == !team && bet.bet_type == "lay") {
        // update amount and bet here the user win the the bet.
        bet.result = "win";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount += bet.stake;
      } else if (bet.runner_name == team && bet.bet_type == "lay") {
        // update amount and bet here the user lose the the bet.
        bet.result = "lose";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount -= bet.stake;
      } else if (bet.runner_name == !team && bet.bet_type == "back") {
        // update amount and bet here the user lose the the bet.
        bet.result = "lose";
        bet.status = "declaired";
        user.exposure_limit -= bet.stake;
        user.amount -= bet.stake;
      }

      await user.save().season(season);
      await bet.save().season(season);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: 200,
      success: true,
      message: "Toss results updated successfully.",
    });
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

module.exports = { DelaireTossResult };
