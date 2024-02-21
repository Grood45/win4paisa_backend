const mongoose = require("mongoose");
const { BetModel } = require("../../models/bet.model");
const User = require("../../models/user.model");

async function ProcessTossAndFancyBets(req, res) {
  try {
    const { answer, user_ids } = req.body; // Get the answer and user_ids from the request body
    // Convert user_ids to an array of ObjectId objects
    const userIdObjects = user_ids.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );
    console.log(answer, user_ids);
    // Step 1: Find all bets with match_category "toss" or "fancy," result "pending," and matching _id
    const betsToUpdate = await BetModel.find({
      bet_category: { $in: ["toss", "fancy"] },
      status: "pending",
      _id: { $in: userIdObjects },
    });
    // Step 2: Iterate through each bet and check if the answer matches

    for (const bet of betsToUpdate) {
      const user = await User.findOne({ user_id: bet.user_id });
      if (answer == "win") {
        // Set the bet result to "win"
        bet.result = "win";
        bet.status = "declaired";
        // Find the user by user_id
        if (user) {
          // Update the user's exposure limit and amount based on the result
          user.exposure_limit -= bet.stake;
          // Calculate the user's new amount (multiplied by 1.8 for a win)
          user.amount += bet.stake;
          // Save the updated user data
        }
      } else if (answer == "lose") {
        // Set the bet result to "lose" if the answer doesn't match
        bet.result = "lose";
        bet.status = "declaired";

        if (user) {
          user.exposure_limit -= bet.stake;
          user.amount -= bet.stake;
        }
      } else {
        // Set the bet result to "lose" if the answer doesn't match
        bet.result = "refund";
        bet.status = "declaired";
        if (user) {
          user.exposure_limit -= bet.stake;
        }
      }
      await user.save();
      // Save the updated bet data
      await bet.save();
    } // Respond with a success message
    res.status(200).json({
      status: 200,
      success: true,
      message: "Bets Fancy/Toss result declaire successfully.",
    });
  } catch (error) {
    console.error("Error processing toss and fancy bets:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

// async function ProcessTossAndFancyBets(req, res) {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { answer, question } = req.body;

//     const betsToUpdate = await BetModel.find({
//       bet_category: "fancy",
//       status: "pending",
//       question: question,
//     }).session(session);

//     for (const bet of betsToUpdate) {
//       const user = await User.findOne({ user_id: bet.user_id }).session(
//         session
//       );

//       if (answer === "win") {
//         bet.result = "win";
//         bet.status = "declared";

//         if (user) {
//           user.exposure_limit -= bet.stake;
//           user.amount += bet.stake;
//           await user.save();
//         }
//       } else if (answer === "lose") {
//         bet.result = "lose";
//         bet.status = "declared";

//         if (user) {
//           user.exposure_limit -= bet.stake;
//           user.amount -= bet.stake;
//           await user.save();
//         }
//       } else {
//         bet.result = "refund";
//         bet.status = "declared";

//         if (user) {
//           user.exposure_limit -= bet.stake;
//           await user.save();
//         }
//       }

//       await bet.save().session(session);
//     }

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: "Bets for Fancy/Toss results declared successfully.",
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();

//     console.error("Error processing toss and fancy bets:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message || "Something went wrong while processing bets.",
//     });
//   }
// }

module.exports = {
  ProcessTossAndFancyBets,
};

// // const FancyResultProcess=async(req, res)=>{
// // const {questionIds=[], result=""}=req.body

// // let uniqueUserIds=[]
// // for (let i=0;i<uniqueUserIds.length;i++){
// // let user=uniqueUserIds[i]
// // const sin=await User.findOne({username:username, user_id:user,user_id})

// // }

// // }

// // if(bet_type=="lay"){

// // }

// // else if(bet_type=="back"){

// // size=

// // }
