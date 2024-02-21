const CasinoModel = require("../../models/casino.model");

const GetAllCasinoBet = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      search = "",
      status,
      match_id,
      event_type,
    } = req.query;

    const skip = (page - 1) * limit;

    let query2 = {};
    if (match_id) {
      query2.MatchId = match_id;
      query2.UserType = "ludocasino";
    }

    if (event_type) {
      query2.EventType = event_type;
    }

    let bet2 = [];

    if (status == "all") {
      bet2 = await CasinoModel.find(query2).skip(skip).page(page);
    } else if (status == "pending") {
      query2.Status = "running";
      bet2 = await CasinoModel.find(query2).skip(skip).page(page);
    } else if (status == "win") {
      query2.ResultType = 0;
      bet2 = await CasinoModel.find(query2).skip(skip).page(page);
    } else if (status == "lose") {
      query2.ResultType = 1;
      bet2 = await CasinoModel.find(query2).skip(skip).page(page);
    } else if (status == "refund") {
      (query2.Status = "void"),
        (bet2 = await CasinoModel.find(query2)).skip(skip).page(page);
    }
    // Iterate through all bets using a for loop

    const allCasinoBets = await CasinoModel.countDocuments({
      UserType: "ludocasino",
    });

    const winCasinoBet = await CasinoModel.countDocuments({
      ResultType: 0,
      UserType: "ludocasino",
    });

    const loseCasinoBet = await CasinoModel.countDocuments({
      ResultType: 1,
      UserType: "ludocasino",
    });

    const pendingCasinoBet = await CasinoModel.countDocuments({
      Status: "running",
      UserType: "ludocasino",
    });

    const refundCasinoBet = await CasinoModel.countDocuments({
      Status: "void",
      UserType: "ludocasino",
    });

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
        loseBet: loseCasinoBet,
        winBet: winCasinoBet,
        pendingBet: pendingCasinoBet,
        refundBet: refundCasinoBet,
        allBet: allCasinoBets,
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

module.exports={GetAllCasinoBet}
