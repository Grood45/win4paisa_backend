const { BetModel } = require("../../models/bet.model");
const User = require("../../models/user.model");

// const DeclaireResultOfFancy = async (req, res) => {
//   try {
//     const { question, answer, rate, size, match_id, league_id } = req.body;
//     // get all bet with above condition.
//     const allFancyBet = await BetModel.find({
//       question: question,
//       match_id: match_id,
//       league_id: league_id,
//       result: "pending",
//       status: "pending",
//     });

//     // here add condition of perticular result
//     for (let f = 0; f < allFancyBet.length; f++) {
//       let bet = allFancyBet[f];
//       if (bet.size >= size&&bet_category=="back") {
//         // user.amount+=bet.stake;
//         // user.exposure_limit-=bet.stake
//         // bet.result="win";

//         let user = await User.findOneAndUpdate(
//           { username: bet.username, user_id: bet.user_id },
//           {$inc:{amount:100}},
//           { new: true }
//         );
//       }
//       else if(bet.size >= size&&bet_category=="lay"){

//       }
//       else if(bet.size < size&&bet_category=="back"){

//       }
//       else if(bet.size < size&&bet_category=="lay"){

//       }
//     }
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };
