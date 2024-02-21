const { default: mongoose } = require("mongoose");
const { BetModel } = require("../../models/bet.model");
const MatchModel = require("../../models/match.model");
const User = require("../../models/user.model");

// async function DeclaireMatchResultAndUpdateExposure(req, res) {
//   try {
//     const { match_id } = req.params;
//     const { runner1, runner2, team, type } = req.body;

//     const allBetsForMatch = await BetModel.find({
//       match_id: match_id,
//       bet_category: { $in: ["bookmaker", "odds"] },
//     });

//     // console.log(allBetsForMatch, "aab");
//     // console.log(allBetsForMatch, runner1, runner2, team);
//     const uniqueUserIds = [
//       ...new Set(allBetsForMatch.map((bet) => bet.user_id)),
//     ];

//     await Promise.all(
//       uniqueUserIds.map(async (userId) => {
//         const userBetsForMatch = allBetsForMatch.filter(
//           (bet) => bet.user_id === userId
//         );

//         // Step 4: Calculate exposure based on user's bets

//         let l2 = 0;
//         let l1 = 0;
//         let exposure = 0;
//         for (const bet of userBetsForMatch) {
//           // if (bet.length <= 0) {
//           //   return;
//           // }
//           if (bet.runner_name === runner1 && bet.bet_type === "back") {
//             l2 -= bet.stake;
//             l1 += bet.stake * bet.rate - bet.stake;
//           }
//           if (bet.runner_name === runner1 && bet.bet_type === "lay") {
//             l1 -= Math.floor(bet.stake * bet.rate - bet.stake);
//             l2 += bet.stake;
//           }
//           if (bet.runner_name === runner2 && bet.bet_type === "back") {
//             l2 += Math.floor(bet.stake * bet.rate);
//             l2 -= bet.stake;
//             l1 -= bet.stake;
//           }
//           if (bet.runner_name === runner2 && bet.bet_type === "lay") {
//             l2 -= Math.floor(bet.stake * bet.rate) - bet.stake;
//             l1 += bet.stake;
//           }
//         }
//         // You can add more logic here for other bet types

//         // Step 5: Update the user's amount and exposure

//         const user = await User.findOne({ user_id: userId });
//         console.log(l1, l2, runner1, runner2);
//         if (runner1 == team) {
//           if (l1 >= 0 && l2 >= 0) {
//             if (user) {
//               user.amount += l1; // Update the user's amount
//               await user.save();
//             }
//           } else if (l1 < 0) {
//             if (user) {
//               user.amount -= -1 * l1; // Update the user's amount
//               user.exposure_limit -= -1 * l1; // Update the user's exposure
//               await user.save();
//             }
//           } else if (l1 >= 0) {
//             if (user) {
//               user.amount += l1; // Update the user's amount
//               user.exposure_limit -= -1 * l2; // Update the user's exposure
//               await user.save();
//             }
//           }
//         } else if (runner2 == team) {
//           if (l1 >= 0 && l2 >= 0) {
//             if (user) {
//               user.amount += l2; // Update the user's amount
//               await user.save();
//             }
//           } else if (l2 < 0) {
//             if (user) {
//               user.amount -= -1 * l2; // Update the user's amount
//               user.exposure_limit -= -1 * l2; // Update the user's exposure
//               await user.save();
//             }
//           } else if (l2 >= 0) {
//             if (user) {
//               user.amount += l2; // Update the user's amount
//               user.exposure_limit -= -1 * l1; // Update the user's exposure
//               await user.save();
//             }
//           }
//         }
//         // console.log(l1, l2);
//       })
//     );

//     const bulkOps = [
//       {
//         updateMany: {
//           filter: {
//             match_id: match_id,
//             bet_category: { $in: ["odds"] },
//           },
//           update: [
//             {
//               $set: {
//                 status: "declaired",
//                 winner: team,
//                 result: {
//                   $cond: {
//                     if: {
//                       $and: [
//                         { $eq: ["$runner_name", team] },
//                         { $eq: ["$bet_type", "back"] },
//                       ],
//                     },
//                     then: "win",
//                     else: {
//                       $cond: {
//                         if: {
//                           $and: [
//                             { $eq: ["$runner_name", team] },
//                             { $eq: ["$bet_type", "lay"] },
//                           ],
//                         },
//                         then: "lose",
//                         else: {
//                           $cond: {
//                             if: {
//                               $and: [
//                                 { $ne: ["$runner_name", team] },
//                                 { $eq: ["$bet_type", "back"] },
//                               ],
//                             },
//                             then: "lose",
//                             else: "win",
//                           },
//                         },
//                       },
//                     },
//                   },
//                 },
//               },
//             },
//           ],
//         },
//       },
//     ];

//     const updatedBets = await BetModel.bulkWrite(bulkOps);
//     let match = await MatchModel.findOneAndUpdate(
//       { match_id },
//       { result: "declaired", winner: team, team: team },
//       { new: true }
//     );
//     // Respond with a success message
//     res.status(200).json({
//       status: 200,
//       success: true,
//       data: { match, updatedBets },
//       message: "Exposure and amount updated successfully",
//     });
//   } catch (error) {
//     // Handle any unexpected errors during the process
//     console.error("Error during exposure calculation and update:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error?.message,
//     });
//   }
// }

async function DeclaireMatchResultAndUpdateExposure(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { match_id } = req.params;
    const { runner1, runner2, runner3 = "The Draw", team, type } = req.body;

    const allBetsForMatch = await BetModel.find({
      match_id: match_id,
      status: "pending",
      bet_category: { $in: ["bookmaker", "odds"] },
    });
    if (!allBetsForMatch || allBetsForMatch.length == 0) {
      return res.status(200).json({
        status: 200,
        success: true,
        data: {},
        message: "No bet found",
      });
    }
    const uniqueUserIds = [
      ...new Set(allBetsForMatch.map((bet) => bet.user_id)),
    ];

    await Promise.all(
      uniqueUserIds.map(async (userId) => {
        const userBetsForMatch = allBetsForMatch.filter(
          (bet) => bet.user_id === userId
        );
        // Step 4: Calculate exposure based on user's bets
        let l2 = 0;
        let l1 = 0;
        let l3 = 0;
        let exposure = 0;
        for (const bet of userBetsForMatch) {
          if (bet.runner_name === runner1 && bet.bet_type === "back") {
            l2 -= bet.stake;
            l1 += bet.stake * bet.rate - bet.stake;
          }
          if (bet.runner_name === runner1 && bet.bet_type === "lay") {
            l1 -= Math.floor(bet.stake * bet.rate - bet.stake);
            l2 += bet.stake;
          }
          if (bet.runner_name === runner2 && bet.bet_type === "back") {
            l2 += Math.floor(bet.stake * bet.rate);
            l2 -= bet.stake;
            l1 -= bet.stake;
          }
          if (bet.runner_name === runner2 && bet.bet_type === "lay") {
            l2 -= Math.floor(bet.stake * bet.rate) - bet.stake;
            l1 += bet.stake;
          }

          // for draw calculation
          if (
            bet.runner_name === runner3 &&
            bet.bet_type === "back" &&
            bet.bet_category == "odds"
          ) {
            l3 += Math.round(Number(bet.stake) * bet.rate - bet.stake);
            // totalDrawBack += bet.stake;
            l1 -= bet.stake;
            l2 -= bet.stake;
          }
          if (
            bet.runner_name === runner3 &&
            bet.bet_type === "lay" &&
            bet.bet_category == "odds"
          ) {
            l3 -= Math.round(Number(bet.stake) * bet.rate - bet.stake);
            // addstake here
            // totalDrawLay += bet.stake;
            l1 += bet.stake;
            l2 += bet.stake;
          }
        }
        const user = await User.findOne({ user_id: userId }).session(session);
        if (runner1 == team) {
          try {
            if (l1 >= 0 && l2 >= 0) {
              if (user) {
                user.amount += l1; // Update the user's amount
                await user.save();
              }
            } else if (l1 < 0) {
              if (user) {
                user.amount -= -1 * l1; // Update the user's amount
                user.exposure_limit -= -1 * l1; // Update the user's exposure
                await user.save();
              }
            } else if (l1 >= 0) {
              if (user) {
                user.amount += l1; // Update the user's amount
                user.exposure_limit -= -1 * l2; // Update the user's exposure
                await user.save();
              }
            }
          } catch (saveError) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Failed to update user data");
          }
        } else if (runner2 == team) {
          try {
            if (l1 >= 0 && l2 >= 0) {
              if (user) {
                user.amount += l2; // Update the user's amount
                await user.save();
              }
            } else if (l2 < 0) {
              if (user) {
                user.amount -= -1 * l2; // Update the user's amount
                user.exposure_limit -= -1 * l2; // Update the user's exposure
                await user.save();
              }
            } else if (l2 >= 0) {
              if (user) {
                user.amount += l2; // Update the user's amount
                user.exposure_limit -= -1 * l1; // Update the user's exposure
                await user.save();
              }
            }
          } catch (saveError) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Failed to update user data");
          }
        }

        if (runner3 === "The Draw") {
          try {
            if (l1 < 0 && l2 < 0) {
              let min = Math.min(l1, l2);
              user.exposure_limit -= -1 * min; // Update the user's exposure
            } else if (l1 < 0) {
              user.exposure_limit -= -1 * l1; // Update the user's exposure
            } else if (l2 < 0) {
              user.exposure_limit -= -1 * l2; // Update the user's exposure
            }
            if (l3 < 0) {
              user.amount -= -1 * l3; // Update the user's amount
              user.exposure_limit -= -1 * l3; // Update the user's exposure
            }
            if (l3 >= 0) {
              user.amount += l3; // Update the user's amount
            }
            await user.save();
          } catch (saveError) {
            await session.abortTransaction();
            session.endSession();
            throw new Error("Failed to update user data");
          }
        }

        // console.log(l1, l2);
      })
    );
    const bulkOps = [
      {
        updateMany: {
          filter: {
            match_id: match_id,
            bet_category: "odds",
          },
          update: [
            {
              $set: {
                status: "declaired",
                winner: team,
                result: {
                  $cond: {
                    if: {
                      $and: [
                        { $eq: ["$runner_name", team] },
                        { $eq: ["$bet_type", "back"] },
                      ],
                    },
                    then: "win",
                    else: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ["$runner_name", team] },
                            { $eq: ["$bet_type", "lay"] },
                          ],
                        },
                        then: "lose",
                        else: {
                          $cond: {
                            if: {
                              $and: [
                                { $ne: ["$runner_name", team] },
                                { $eq: ["$bet_type", "back"] },
                              ],
                            },
                            then: "lose",
                            else: "win",
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    ];
    const updatedBets = await BetModel.bulkWrite(bulkOps, { session });
    let match = await MatchModel.findOneAndUpdate(
      { match_id },
      { result: "declaired", winner: team, team: team },
      { new: true, session }
    );
    // Check if any updates failed
    if (!match || !updatedBets) {
      await session.abortTransaction();
      session.endSession();
      throw new Error("Failed to update exposure and bets");
    }
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      status: 200,
      success: true,
      data: { match, updatedBets },
      message: "Exposure and amount updated successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error during exposure calculation and update:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error?.message || "Something went wrong",
    });
  }
}

// const DeclaireRefundResult = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const allBetsForMatch = await BetModel.find({
//       match_id: match_id,
//       status: "pending",
//       bet_category: { $in: ["bookmaker", "odds"] },
//     });
//     if (!allBetsForMatch || allBetsForMatch.length == 0) {
//       return res.status(200).json({
//         status: 200,
//         success: true,
//         data: {},
//         message: "No bet found",
//       });
//     }
//     for (let g = 0; g < allBetsForMatch.length; g++) {
//       let bet = allBetsForMatch[g];
//     }
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     console.error("Error during exposure calculation and update:", error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error?.message || "Something went wrong",
//     });
//   }
// };

module.exports = { DeclaireMatchResultAndUpdateExposure };
