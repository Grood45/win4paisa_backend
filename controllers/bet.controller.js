const { default: mongoose } = require("mongoose");
const { BetModel } = require("../models/bet.model");
const CasinoModel = require("../models/casino.model");
const User = require("../models/user.model");
const { ConvertStructureToBet } = require("../utils/ConvertStructureToBet");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
const { FancyQuestionModel } = require("../models/fancyquestion.model");

const GetAllBet = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      match_id,
      category,
      event_type,
    } = req.query;

    const skip = (page - 1) * limit;
    let query = {};
    let query2 = {};
    if (match_id) {
      query.match_id = match_id;
      query2.MatchId = match_id;
    }
    if (category) {
      query.bet_category = category;
    }
    // query.user_type = "bajivairent";   
    query2.UserType = "bajivairent";

    if (event_type) {
      query.event_type = event_type;
      query2.EventType = event_type;
    }
    let bet = [];
    let bet2 = [];
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { status: { $regex: search.toString(), $options: "i" } },
        ],
      };
      query2 = {
        $or: [{ Username: { $regex: search, $options: "i" } }],
      };
    }

    if (status == "all") {
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "pending") {
      (query.status = "pending"), (query2.Status = "running");
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "win") {
      (query.status = "win"), (query2.ResultType = 0);
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "lose") {
      (query.status = "lose"), (query2.ResultType = 1);
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "refund") {
      (query.status = "refund"),
        (query2.Status = "void"),
        (bet = await BetModel.find(query));
      bet2 = await CasinoModel.find(query2);
    }
    bet2 = ConvertStructureToBet(bet2);
    let totalBetAmount = 0;
    let casinoBetAmount = 0;
    let sportBetAmount = 0;

    let totalBet = [...bet, ...bet2];

    // Iterate through all bets using a for loop
    for (let i = 0; i < totalBet.length; i++) {
      const bet = totalBet[i];
      totalBetAmount += bet.stake;
      if (bet.event_type == "casino") {
        casinoBetAmount += bet.stake;
      } else if (bet.event_type == "sport") {
        sportBetAmount += bet.stake;
      }
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        if (a.placed_at > b.placed_at) {
          return -1;
        }
        if (b.placed_at > a.placed_at) {
          return 1;
        } else {
          return 0;
        }
      });

      return ans;
    }

    totalBet = sortByPlacedAt(totalBet);
    const allSportBets = await BetModel.countDocuments();
    const allCasinoBets = await CasinoModel.countDocuments({
      UserType: "bajivairent",
    });

    const winSportBet = await BetModel.countDocuments({
      status: "win",
      // user_type: "bajivairent",
    });

    const loseSportBet = await BetModel.countDocuments({
      status: "lose",
      // user_type: "bajivairent",
    });

    const pendingSportBet = await BetModel.countDocuments({
      status: "pending",
      // user_type: "bajivairent",
    });

    const refundSportBet = await BetModel.countDocuments({
      status: "refund",
      // user_type: "bajivairent",
    });

    const winCasinoBet = await CasinoModel.countDocuments({
      ResultType: 0,
      UserType: "bajivairent",
    });

    const loseCasinoBet = await CasinoModel.countDocuments({
      ResultType: 1,
      UserType: "bajivairent",
    });

    const pendingCasinoBet = await CasinoModel.countDocuments({
      Status: "running",
      UserType: "bajivairent",
    });

    const refundCasinoBet = await CasinoModel.countDocuments({
      Status: "void",
      UserType: "bajivairent",
    });

    let totalItems = totalBet.length || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Implementing pagination
    data = (totalBet || []).slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalBet.length / limit);
    const pagination = {
      totalbet: totalItems,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: data,
      betsCount: {
        loseBet: loseSportBet + loseCasinoBet,
        winBet: winSportBet + winCasinoBet,
        pendingBet: pendingSportBet + pendingCasinoBet,
        refundBet: refundSportBet + refundCasinoBet,
        allBet: allSportBets + allCasinoBets,
      },
      betAmount: {
        totalBetAmount,
        casinoBetAmount,
        sportBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllBetsForResult = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 20; // Default to 10 items per page if not specified
    const searchQuery = req.query.search || req.query.name; // Default to an empty string if not specified
    const betCategory = req.query.bet_category || null; // Default to null if not specified
    const status = req.query.status;
    const bet_type = req.query.bet_type;
    const question = req.query.question;
    const sport = req.query.event_name || null;
    const skip = (page - 1) * limit;

    // Create a query object
    const query = {};
    // query.user_type = "bajivairent";
    // Add search functionality
    if (searchQuery) {
      query.$or = [
        { match_name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on the 'name' field
        { league_name: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on the 'description' field
        { question: { $regex: searchQuery, $options: "i" } },
        { username: { $regex: searchQuery, $options: "i" } },
      ];
    }
    // Add filter by bet_category if provided
    if (betCategory) {
      query.bet_category = betCategory;
    }
    if (status) {
      query.status = status;
    }
    if (bet_type) {
      query.bet_type = bet_type;
    }
    if (sport) {
      query.event_name = sport;
    }
    if (question) {
      query.question = question;
    }

    // Query the database with pagination, search, and filtering
    const bets = await BetModel.find(query)
      .sort({ placed_at: -1 })
      .skip(skip)
      .limit(limit);
    const totalBets = await BetModel.countDocuments(query);
    const totalOdds = await BetModel.countDocuments({
      bet_category: "odds",
      // user_type: "bajivairent",
    });
    const totaToss = await BetModel.countDocuments({
      bet_category: "toss",
      // user_type: "bajivairent",
    });
    const totalBookmaker = await BetModel.countDocuments({
      bet_category: "bookmaker",
      // user_type: "bajivairent",
    });
    const totalFancy = await BetModel.countDocuments({
      bet_category: "fancy",
      // user_type: "bajivairent",
    });
    const totalOddsPending = await BetModel.countDocuments({
      bet_category: "odds",
      status: "pending",
      // user_type: "bajivairent",
    });

    const totaTossPending = await BetModel.countDocuments({
      bet_category: "toss",
      status: "pending",
      // user_type: "bajivairent",
    });

    const totalBookmakerPending = await BetModel.countDocuments({
      bet_category: "bookmaker",
      status: "pending",
      // user_type: "bajivairent",
    });

    const totalFancyPending = await BetModel.countDocuments({
      bet_category: "fancy",
      status: "pending",
      // user_type: "bajivairent",
    });

    const totalPages = Math.ceil(totalBets / limit);

    // Create a pagination object
    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalBets,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: bets,
      message: "Bets retrieved successfully",
      pagination, // Include the pagination object in the response
      totalOdds,
      totalOddsPending,
      totaToss,
      totaTossPending,
      totalBookmaker,
      totalBookmakerPending,
      totalFancy,
      totalFancyPending,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

const GetAllBetByUserId = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      match_id,
      category,
      event_type,
      username,
    } = req.query;

    const { user_id } = req.params;
    const skip = (page - 1) * limit;
    let query = {};
    let query2 = {};
    if (user_id) {
      query.user_id = user_id;
    }
    if (username) {
      query2.Username = username;
    }
    if (match_id) {
      query.match_id = match_id;
      query2.MatchId = match_id;
    }
    if (category) {
      query.bet_category = category;
    }

    if (event_type) {
      query.event_type = event_type;
      query2.EventType = event_type;
    }

    query2.UserType = "bajivairent";
    let bet = [];
    let bet2 = [];
    if (search) {
      query = {
        $or: [
          { username: { $regex: search, $options: "i" } },
          { status: { $regex: search.toString(), $options: "i" } },
        ],
      };
      query2 = {
        $or: [{ Username: { $regex: search, $options: "i" } }],
      };
    }
    console.log(query, "query");
    if (status == "all") {
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "pending") {
      (query.status = "pending"), (query2.Status = "running");
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "win") {
      (query.status = "win"), (query2.ResultType = 0);
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "lose") {
      (query.status = "lose"), (query2.ResultType = 1);
      bet = await BetModel.find(query);
      bet2 = await CasinoModel.find(query2);
    } else if (status == "refund") {
      (query.status = "refund"),
        (query2.Status = "void"),
        (bet = await BetModel.find(query));
      bet2 = await CasinoModel.find(query2);
    }
    let allSportBet = await BetModel.find({ user_id });
    let allCasinoBet = await CasinoModel.find({
      Username: username,
      UserType: "bajivairent",
    });
    allCasinoBet = ConvertStructureToBet(allCasinoBet);
    let totalBetAmount = 0;
    let casinoBetAmount = 0;
    let sportBetAmount = 0;

    let totalBet = [...bet];
    let amountBet = [...allSportBet, ...allCasinoBet];
    // Iterate through all bets using a for loop
    for (let i = 0; i < totalBet.length; i++) {
      const bet = totalBet[i];
      totalBetAmount += bet.stake;
      if (bet.event_type == "casino") {
        casinoBetAmount += bet.stake;
      } else if (bet.event_type == "sport") {
        sportBetAmount += bet.stake;
      }
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.placed_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.placed_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    totalBet = sortByPlacedAt(totalBet);
    const allSportBets = await BetModel.countDocuments({ user_id });
    const allCasinoBets = await CasinoModel.countDocuments({
      Username: username,
      UserType: "bajivairent",
    });

    const winSportBet = await BetModel.countDocuments({
      status: "win",
      user_id,
    });

    const loseSportBet = await BetModel.countDocuments({
      status: "lose",
      user_id,
    });

    const pendingSportBet = await BetModel.countDocuments({
      status: "pending",
      user_id,
    });

    const refundSportBet = await BetModel.countDocuments({
      status: "refund",
      user_id,
    });

    const winCasinoBet = await CasinoModel.countDocuments({
      ResultType: 0,
      Username: username,
      UserType: "bajivairent",
    });

    const loseCasinoBet = await CasinoModel.countDocuments({
      ResultType: 1,
      Username: username,
      UserType: "bajivairent",
    });

    const pendingCasinoBet = await CasinoModel.countDocuments({
      Status: "running",
      Username: username,
      UserType: "bajivairent",
    });

    const refundCasinoBet = await CasinoModel.countDocuments({
      Status: "void",
      Username: username,
      UserType: "bajivairent",
    });

    let totalItems = totalBet.length || 0;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Implementing pagination
    data = (totalBet || []).slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalBet.length / limit);
    const pagination = {
      totalbet: totalItems,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: data,
      betsCount: {
        loseBet: loseSportBet + loseCasinoBet,
        winBet: winSportBet + winCasinoBet,
        pendingBet: pendingSportBet + pendingCasinoBet,
        refundBet: refundSportBet + refundCasinoBet,
        allBet: allSportBets + allCasinoBets,
      },
      betAmount: {
        totalBetAmount,
        casinoBetAmount,
        sportBetAmount,
      },
      pagination,
      message: "Bet data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function PlaceBet(req, res) {
  try {
    const {
      user_id,
      username,
      match_id,
      match_date,
      match_name,
      event_name,
      event_type,
      league_id,
      bet_type,
      stake,
      rate,
      runner_name,
      bet_category,
      question = "",
      league_name,
      exposure_limit,
    } = req.body;

    // Create a new bet record
    const newBet = new BetModel({
      user_id,
      username,
      match_id,
      match_date,
      match_name,
      placed_at: GetCurrentTime(),
      event_name,
      event_type,
      league_id,
      bet_type,
      stake,
      rate,
      runner_name,
      bet_category,
      question: question,
      league_name,
      exposure_limit,
    });

    // Save the new bet to the database
    const savedBet = await newBet.save();
    res.status(201).json({
      status: 201,
      success: true,
      data: savedBet,
      message: "Bet placed successfully",
    });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function UpdateExposureLimit(req, res) {
  try {
    const { user_id } = req.params;
    const { exposure_limit } = req.body;

    // Find the user by user_id and update their exposure_limit
    const updatedUser = await UserModel.findOneAndUpdate(
      { user_id, user_type: "bajivairent" },
      { exposure_limit },
      { new: true } // To return the updated user
    ).exec();

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      status: 200,
      success: true,
      data: updatedUser,
      message: "Exposure limit updated successfully",
    });
  } catch (error) {
    console.error("Error updating exposure limit:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function PlaceBetAndUpdateExposure(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      user_id,
      username,
      match_id,
      match_date = GetCurrentTime(),
      match_name,
      event_name,
      event_type,
      league_id,
      bet_type,
      stake,
      rate,
      runner_name,
      bet_category,
      question = "",
      league_name,
      size = 0,
      exposure_limit,
      question_id = "",
      market_id = "",
    } = req.body;

    console.log(exposure_limit);
    const newBet = new BetModel({
      user_id,
      username,
      match_id,
      match_date,
      match_name,
      placed_at: GetCurrentTime(),
      event_name,
      event_type,
      league_id,
      bet_type,
      stake,
      rate,
      size,
      runner_name,
      bet_category,
      question: question,
      league_name,
      market_id,
      question_id,
    });

    let singleQuestion = {
      question: question,
      match_id: match_id,
      match_name: match_name,
      league_id: league_id,
      league_name: league_name,
      created_at: GetCurrentTime(),
      question_id: question_id,
      market_id: market_id,
    };
    if (bet_category == "fancy") {
      let questionData = await FancyQuestionModel.updateOne(
        { question_id: question_id, match_id: match_id, question: question },
        singleQuestion,
        { upsert: true }
      );
      if (!questionData) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Something went wrong while saving the question.",
        });
      }
    }
    const savedBet = await newBet.save();
    if (!savedBet) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Something went wrong while saving the bet.",
      });
    }

    // Update user's exposure limit
    const updatedUser = await User.findOneAndUpdate(
      { user_id, user_type: "bajivairent" },
      { exposure_limit },
      { new: true, session }
    ).exec();

    if (!updatedUser) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found",
      });
    }

    // Commit the transaction if everything succeeds
    await session.commitTransaction();
    session.endSession();

    // Send success response
    res.status(200).json({
      status: 201,
      success: true,
      data: { bet: savedBet, user: updatedUser },
      message: "Bet placed and exposure limit updated successfully",
    });
  } catch (error) {
    console.error("Error placing bet and updating exposure limit:", error);
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = {
  GetAllBet,
  GetAllBetsForResult,
  GetAllBetByUserId,
  PlaceBet,
  UpdateExposureLimit,
  PlaceBetAndUpdateExposure,
};
