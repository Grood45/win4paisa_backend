const { BetModel } = require("../models/bet.model");
const CasinoModel = require("../models/casino.model");
const CasinoProvider = require("../models/casinoprovider.model");
const { FancyQuestionModel } = require("../models/fancyquestion.model");
const LeagueModel = require("../models/league.model");
const MatchModel = require("../models/match.model");
const { SportModel } = require("../models/sport.model");
const { FormatDate } = require("../utils/FormatDataFor");

const GetAllMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const { category } = req.query;
    const nameQuery = req.query.name || "";
    const skip = (page - 1) * limit;
    const sport = req.query.event_name;

    // Fetch only active league IDs from LeagueModel
    const activeLeagueIds = await LeagueModel.distinct("league_id", {
      status: true,
    });

    // Fetch active sports from MarketModel

    const activeSports = await SportModel.find({ status: true }).distinct(
      "sport_id"
    );

    // Ensure activeSports is an array of strings
    const activeSportsArray = activeSports.map(String);
    const query = {
      sport_id: { $in: activeSportsArray }, // Use activeSportsArray instead of activeSports
      league_id: { $in: activeLeagueIds },
    };

    if (nameQuery) {
      query.$or = [
        { match_name: { $regex: nameQuery, $options: "i" } },
        { league_name: { $regex: nameQuery, $options: "i" } },
      ];
    }
    if (sport) {
      query.sport_name = sport;
    }

    const sortCriteria = { status: 1 };

    const matches = await MatchModel.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalMatches = await MatchModel.countDocuments(query);

    const totalPages = Math.ceil(totalMatches / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalMatches,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: matches,
      message: "Matches retrieved successfully",
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const ToggleMatchStatus = async (req, res) => {
  try {
    const { match_id } = req.params;
    const { name } = req.body;
    // Find the market document by ID
    const match = await MatchModel.findOne({ match_id: match_id });
    // Toggle the status
    // console.log(id);
    match.status = match.status === false ? true : false;

    //  console.log(match[name],ff,"kk")
    // // Save the updated market document
    await match.save();
    console.log(match);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Status toggled successfully",
      data: match,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetCricketMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const { category } = req.query;
    const nameQuery = req.query.name || "";
    const skip = (page - 1) * limit;

    // Fetch only active league IDs from LeagueModel
    const activeLeagueIds = await LeagueModel.distinct("league_id", {
      // status: true,
    });

    // Fetch active sports from MarketModel

    const activeSports = await SportModel.find({
      status: true,
      sport_id: 4,
    }).distinct("sport_id");
    const currentDate = new Date();
    let today = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate()
    );
    today = FormatDate(currentDate);
    // Ensure activeSports is an array of strings

    const activeSportsArray = activeSports.map(String);
    console.log(today);
    const query = {
      status: true,
      sport_id: { $in: activeSportsArray }, // Use activeSportsArray instead of activeSports
      league_id: { $in: activeLeagueIds },
    };

    if (nameQuery) {
      query.$or = [
        { match_name: { $regex: nameQuery, $options: "i" } },
        { league_name: { $regex: nameQuery, $options: "i" } },
      ];
    }

    const sortCriteria = { status: 1 };

    const matches = await MatchModel.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalMatches = await MatchModel.countDocuments(query);

    const totalPages = Math.ceil(totalMatches / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalMatches,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: matches,
      message: "Matches retrieved successfully",
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetTennisMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const { category } = req.query;
    const nameQuery = req.query.name || "";
    const skip = (page - 1) * limit;

    // Fetch only active league IDs from LeagueModel
    const activeLeagueIds = await LeagueModel.distinct("league_id", {
      // status: true,
    });

    // Fetch active sports from MarketModel

    const activeSports = await SportModel.find({ sport_id: 2 }).distinct(
      "sport_id"
    );

    // Ensure activeSports is an array of strings
    const activeSportsArray = activeSports.map(String);
    const query = {
      status: true,
      sport_id: { $in: activeSportsArray }, // Use activeSportsArray instead of activeSports
      league_id: { $in: activeLeagueIds },
    };

    if (nameQuery) {
      query.$or = [
        { match_name: { $regex: nameQuery, $options: "i" } },
        { league_name: { $regex: nameQuery, $options: "i" } },
      ];
    }

    const sortCriteria = { status: 1 };

    const matches = await MatchModel.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalMatches = await MatchModel.countDocuments(query);

    const totalPages = Math.ceil(totalMatches / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalMatches,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: matches,
      message: "Matches retrieved successfully",
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetSoccerMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1000;
    const { category } = req.query;
    const nameQuery = req.query.name || "";
    const skip = (page - 1) * limit;

    // Fetch only active league IDs from LeagueModel
    const activeLeagueIds = await LeagueModel.distinct("league_id", {
      // status: true,
    });

    // Fetch active sports from MarketModel

    const activeSports = await SportModel.find({ sport_id: 1 }).distinct(
      "sport_id"
    );

    // Ensure activeSports is an array of strings
    const activeSportsArray = activeSports.map(String);
    const query = {
      status: true,
      sport_id: { $in: activeSportsArray }, // Use activeSportsArray instead of activeSports
      league_id: { $in: activeLeagueIds },
    };

    if (nameQuery) {
      query.$or = [
        { match_name: { $regex: nameQuery, $options: "i" } },
        { league_name: { $regex: nameQuery, $options: "i" } },
      ];
    }

    const sortCriteria = { status: 1 };

    const matches = await MatchModel.find(query)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const totalMatches = await MatchModel.countDocuments(query);

    const totalPages = Math.ceil(totalMatches / limit);

    const pagination = {
      currentPage: page,
      totalPages,
      totalItems: totalMatches,
      limit,
    };

    return res.status(200).json({
      status: 200,
      success: true,
      data: matches,
      message: "Matches retrieved successfully",
      pagination,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetSingleMatch = async (req, res) => {
  try {
    const { match_id } = req.params;
    const match = await MatchModel.findOne({ match_id });

    res.status(200).json({
      status: 200,
      success: true,
      message: "Match retrieved successfully",
      data: match,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateMatchLogo = async (req, res) => {
  try {
    const { match_id } = req.params;
    let payload = req.body;
    const match = await MatchModel.findOneAndUpdate({ match_id }, payload, {
      new: true,
    });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Update logo successfully",
      data: match,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAdminSportsCount = async (req, res) => {
  try {
    const { control_id } = req.params;
    // Find the market document by ID
    const totalSport = await SportModel.countDocuments({ status: true });
    const totalLeague = await LeagueModel.countDocuments({ status: true });
    const totalMatch = await MatchModel.countDocuments({ status: true });
    const totalCasinoBet = await CasinoModel.countDocuments();
    const totalSportBet = await BetModel.countDocuments();
    const totalCasinoEvent = await CasinoModel.countDocuments();
    const totalCasinoProvider = await CasinoProvider.countDocuments({
      status: true,
    });
    let gameCount = {
      totalSport: totalSport || 0,
      totalLeague: totalLeague || 0,
      totalMatch: totalMatch || 0,
      totalSportBet: totalSportBet || 0,
      totalCasino: totalCasinoProvider || 0,
      totalCasinoProvider: totalCasinoProvider || 0,
      totalCasinoBet: totalCasinoBet || 0,
      totalCasinoEvent: totalCasinoEvent || 0,
    };

    res.status(200).json({
      status: 200,
      success: true,
      message: "Control retrieved successfully",
      data: gameCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllQuestion = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { match_name: { $regex: search, $options: "i" } },
        { league_name: { $regex: search, $options: "i" } },
        { question: { $regex: search, $options: "i" } },
      ];
    }
    const allFancy = await FancyQuestionModel.find(query);
    res.status(200).json({
      status: 200,
      success: true,
      message: "Fancy retrieved successfully.",
      data: allFancy,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateMatchId = async (req, res) => {
  const { id } = req.params; // Get the _id from request parameters
  const { match_id } = req.body; // Get the match_id from request body

  try {
    const document = await MatchModel.findOne({_id: id });
console.log(document)

    if (!document) {
      // If document with the specified _id is not found, send a 404 response
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'Document not found',
      });
    }
    // Update the ex_match_id with the value from request body
    document.ex_match_id = match_id;
    await document.save();

    // Send a success response
    res.status(200).json({
      status: 200,
      success: true,
      message: 'Document updated successfully',
      data: document, // Optionally, you can send the updated document in the response
    });
  } catch (error) {
    // If an error occurs during the process, send a 500 response with the error message
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  GetAllMatches,
  ToggleMatchStatus,
  GetSoccerMatches,
  GetTennisMatches,
  GetCricketMatches,
  GetSingleMatch,
  UpdateMatchLogo,
  GetAdminSportsCount,
  GetAllQuestion,
  UpdateMatchId
};
