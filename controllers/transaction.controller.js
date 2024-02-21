const WithdrawModel = require("../models/withdraw.model");
const DepositModel = require("../models/deposit.model");
const { v4: uuidv4 } = require("uuid");
const { GetCurrentTime } = require("../utils/GetCurrentTime");
const User = require("../models/user.model");
const CasinoModel = require("../models/casino.model");
const { BetModel } = require("../models/bet.model");
const { default: mongoose } = require("mongoose");

const GetAllWithdrawTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    let withdraw = [];
    // if (search) {
    //   query = {
    //     $or: [
    //       { username: { $regex: search, $options: "i" } },
    //       { withdraw_amount: { $regex: search.toString(), $options: "i" } },
    //     ],
    //   };
    // }
    if (search) {
      query.$or = [
        { method: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }


    if (transaction_type == "all") {
      withdraw = await WithdrawModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }
    const allTransaction = await WithdrawModel.countDocuments();
    const approvedTransaction = await WithdrawModel.countDocuments({
      status: "approved",
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      status: "pending",
    });
    const rejectTransaction = await WithdrawModel.countDocuments({
      status: "reject",
    });
    const totalPages = Math.ceil(allTransaction.length / limit);
    const pagination = {
      totalWithdrawal: withdraw.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    const allWithdraw =
      (await WithdrawModel.find({ status: "approved" })) || [];
    let totalWithdrawAmount = 0;

    for (i = 0; i < allWithdraw.length; i++) {
      totalWithdrawAmount += allWithdraw[i].withdraw_amount;
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    withdraw = sortByPlacedAt(withdraw);
    res.status(200).json({
      status: 200,
      success: true,
      data: withdraw,
      total_withdraw_amount: totalWithdrawAmount || 0,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      pagination,
      message: "Withdraw data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetAllDepositTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const skip = (page - 1) * limit;
    let query = {};
    let deposit = [];
    if (search) {
      query.$or = [
        { method: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }
    // query.user_type="bajivairent"
    if (transaction_type == "all") {
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
      console.log(query, 1);
    } else if (transaction_type === "pending") {
      query.status = "pending"; // Using equality check here
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
      console.log(query, 2);
    } else if (transaction_type === "reject") {
      query.status = "reject"; // Using equality check here
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
      console.log(query, 3);
    } else if (transaction_type === "approved") {
      query.status = "approved"; // Using equality check here
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
      console.log(query, 4);
    }
    const allTransaction = await DepositModel.countDocuments();
    const totalPages = Math.ceil(allTransaction.length / limit);
    
    const approvedTransaction = await DepositModel.countDocuments({
      status: "approved",
    });
    const pendingTransaction = await DepositModel.countDocuments({
      status: "pending",
    });
    const rejectTransaction = await DepositModel.countDocuments({
      status: "reject",
    });
    const pagination = {
      totalDeposit: deposit.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    const allDeposit = (await DepositModel.find({ status: "approved" })) || [];
    let totalDepositAmount = 0;

    for (i = 0; i < allDeposit.length; i++) {
      totalDepositAmount += allDeposit[i].deposit_amount;
    }

    function sortByPlacedAt(arr) {
      // Sort the array of objects by the 'placed_at' field
      let ans = arr.sort((a, b) => {
        const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
        const dateB = new Date(b.initiated_at).getTime();
        return dateB - dateA; // Sort based on timestamps
      });
      return ans;
    }
    deposit = sortByPlacedAt(deposit);

    res.status(200).json({
      status: 200,
      success: true,
      data: deposit,
      total_deposit_amount: totalDepositAmount || 0,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      pagination,
      message: "Deposit data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

const GetWithdrawByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const { user_id } = req.params;
    const skip = (page - 1) * limit;
    let query = {};
    let withdraw = [];
    if (search) {
      query = {
        $or: [
          { withdraw_amount: { $regex: search, $options: "i" } },
          { withdraw_amount: { $regex: search.toString(), $options: "i" } },
        ],
      };
    }
    // query.user_type="bajivairent"
    query.user_id = user_id;
    if (transaction_type == "all") {
      withdraw = await WithdrawModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (withdraw = await WithdrawModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }

    const allTransaction = await WithdrawModel.countDocuments({ user_id});

    const approvedTransaction = await WithdrawModel.countDocuments({
      status: "approved",
      user_id,
      // user_type:"bajivairent" 
    });
    const pendingTransaction = await WithdrawModel.countDocuments({
      status: "pending",
      user_id,
      // user_type:"bajivairent" 
    });
    const rejectTransaction = await WithdrawModel.find({
      status: "reject",
      user_id,
      // user_type:"bajivairent" 
    });

    const allTransactions = await WithdrawModel.find({ user_id});

    // Calculate total withdraw amounts for different statuses
    let allAmount = 0;
    let approvedAmount = 0;
    let pendingAmount = 0;
    let rejectAmount = 0;

    allTransactions.forEach((transaction) => {
      if (transaction.status === "approved") {
        approvedAmount += transaction.withdraw_amount;
      } else if (transaction.status === "pending") {
        pendingAmount += transaction.withdraw_amount;
      } else if (transaction.status === "reject") {
        rejectAmount += transaction.withdraw_amount;
      }

      // Calculate total amount regardless of status
      allAmount += transaction.withdraw_amount;
    });

    const totalPages = Math.ceil(withdraw.length / limit);
    const pagination = {
      totalWithdrawal: withdraw.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: withdraw,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      transactionAmount: {
        allAmount,
        approvedAmount,
        pendingAmount,
        rejectAmount,
      },
      pagination,
      message: "Withdraw data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const GetDepositByUserId = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", transaction_type } = req.query;
    const { user_id } = req.params;
    const skip = (page - 1) * limit;
    let query = {};
    let deposit = [];
    if (search) {
      query = {
        $or: [
          { deposit_amount: { $regex: search, $options: "i" } },
          { username: { $regex: search, $options: "i" } },
        ],
      };
    }
  //  query.user_type="bajivairent" 
    query.user_id = user_id;
    if (transaction_type == "all") {
      deposit = await DepositModel.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ initiated_at: -1 });
    } else if (transaction_type == "pending") {
      (query.status = "pending"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "reject") {
      (query.status = "reject"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    } else if (transaction_type == "approved") {
      (query.status = "approved"),
        (deposit = await DepositModel.find(query)
          .skip(skip)
          .limit(parseInt(limit))
          .sort({ initiated_at: -1 }));
    }
    const allTransaction = await WithdrawModel.countDocuments({ user_id });

    const approvedTransaction = await DepositModel.countDocuments({
      status: "approved",
      user_id,
      // user_type:"bajivairent" 
    });
    const pendingTransaction = await DepositModel.countDocuments({
      status: "pending",
      user_id,
      // user_type:"bajivairent" 
    });
    const rejectTransaction = await DepositModel.countDocuments({
      status: "reject",
      user_id,
      // user_type:"bajivairent" 
    });

    const allTransactions = await DepositModel.find({ user_id,user_type:"bajivairent"  });

    // Calculate total withdraw amounts for different statuses
    let allAmount = 0;
    let approvedAmount = 0;
    let pendingAmount = 0;
    let rejectAmount = 0;

    allTransactions.forEach((transaction) => {
      if (transaction.status === "approved") {
        approvedAmount += transaction.deposit_amount;
      } else if (transaction.status === "pending") {
        pendingAmount += transaction.deposit_amount;
      } else if (transaction.status === "reject") {
        rejectAmount += transaction.deposit_amount;
      }

      // Calculate total amount regardless of status
      allAmount += transaction.deposit_amount;
    });

    const totalPages = Math.ceil(deposit.length / limit);
    const pagination = {
      totalDeposit: deposit.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    res.status(200).json({
      status: 200,
      success: true,
      data: deposit,
      transactionsCount: {
        approvedTransaction,
        pendingTransaction,
        rejectTransaction,
        allTransaction,
      },
      transactionAmount: {
        allAmount,
        approvedAmount,
        pendingAmount,
        rejectAmount,
      },
      pagination,
      message: "Deposit data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CreateDepositTransaction = async (req, res) => {
  try {
    // Create a new RulesRegulation document with data from the request body

    const allDepositData = await DepositModel.find();
    let payload = {
      ...req.body,
      initiated_at: GetCurrentTime(),
      transaction_id: "TRNX" + (allDepositData.length || 0) + 1,
    };

    const previousResult = await DepositModel.findOne({
      user_id: payload.user_id,
      status: "pending",
      // user_type:"bajivairent" 
    });
    if (previousResult) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Previous deposit request not completed.",
      });
    }
    const user = await User.findOne({
      user_id: payload.user_id,
      // user_type:"bajivairent"
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "User not found.",
      });
    }

    console.log("oniwsndin", payload);
    const deposit = new DepositModel(payload);

    // Save the document to the database
    const depositData = await deposit.save();

    res.status(201).json({
      status: 201,
      success: true,
      data: depositData,
      message: "Deposit request placed successfully.",
    });
  } catch (error) {
    console.error("Error adding deposit:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const CreateWithdrawTransaction = async (req, res) => {
  try {
    const allWithdraw = await WithdrawModel.find();
    let payload = {
      ...req.body,
      initiated_at: GetCurrentTime(),
      transaction_id: "TRNX" + (+allWithdraw.length || 0) + 1,
    };
    // console.log(payload);
    // Create a new RulesRegulation document with data from the request body
    const previousResult = await WithdrawModel.findOne({
      user_id: payload.user_id,
      status: "pending",
    });

    if (previousResult) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Previous withdraw request not completed.",
      });
    }
    const user = await User.findOne({
      user_id: payload.user_id,
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "User not found.",
      });
    }
    if (payload.withdraw_amount > user.amount) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "insufficient balance.",
      });
    }

    const results = await WithdrawModel.find({
      user_id: payload.user_id,
      status: "approved",
      // user_type:"bajivairent" 
    });

    // Filter the results based on the initiated_at field within your application
    const filteredResults = results.filter((item) => {
      // Assuming initiated_at is a string in the format "YYYY-MM-DD hh:mm A/PM"
      const currentDate = new Date();
      const itemDate = new Date(item.initiated_at); // Convert the string to a Date object

      // Compare the dates (you might need to handle timezone differences)
      return (
        itemDate.getFullYear() === currentDate.getFullYear() &&
        itemDate.getMonth() === currentDate.getMonth() &&
        itemDate.getDate() === currentDate.getDate()
      );
    });

    let withdrawAmount = 0;
    for (let d = 0; d < filteredResults.length; d++) {
      withdrawAmount += filteredResults[d].withdraw_amount;
    }
    let after_amount = withdrawAmount + payload.withdraw_amount;
    if (after_amount > user.max_limit) {
      return res.status(500).json({
        status: 500,
        success: true,
        message: "Today limit exceed.",
      });
    }
    const withdraw = new WithdrawModel(payload);
    // Save the document to the database
    const withdrawData = await withdraw.save();

    res.status(201).json({
      status: 201,
      success: true,
      data: withdrawData,
      message: "Withdraw request placed successfully.",
    });
  } catch (error) {
    console.error("Error adding Withdraw:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

async function GetTransactionsByUserId(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 10 if not provided

  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.find({ user_id });
    const withdrawals = await WithdrawModel.find({ user_id });

    // Merge and sort the transactions by initiated_at in descending order (newest first)
    const allTransactions = [...deposits, ...withdrawals].sort((a, b) => {
      const dateA = new Date(a.initiated_at).getTime(); // Convert dates to timestamps
      const dateB = new Date(b.initiated_at).getTime();

      return dateB - dateA; // Sort based on timestamps
    });

    // Apply pagination using limit and offset
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedTransactions = allTransactions.slice(startIndex, endIndex);

    // Calculate total pages
    const totalPages = Math.ceil(allTransactions.length / pageSize);

    // Prepare pagination details
    const pagination = {
      totalTransactions: allTransactions.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(pageSize),
    };

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: paginatedTransactions,
      pagination: pagination,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
}

async function GetDepositById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  try {
    // Find deposits and withdrawals for the given user_id
    const deposit = await DepositModel.findOne({ _id: _id});
    // Send the response with transactions and pagination details
    if (!deposit) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: deposit,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function GetWithdrawById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  try {
    // Find deposits and withdrawals for the given user_id
    const deposit = await WithdrawModel.findOne({ _id: _id });
    // Send the response with transactions and pagination details
    if (!deposit) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    }
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transactions retrieved successfully.",
      data: deposit,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function UpdateWithdrawById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  const payload = req.body;
  const withdraw_status = { status: payload.status };
  try {
    // Find deposits and withdrawals for the given user_id
    const withdrawData = await WithdrawModel.findOne({ _id: _id });
    // Send the response with transactions and pagination details
    if (!withdrawData) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    } else {
      console.log(withdrawData, "withdraw data");
      if (withdrawData.status !== "pending") {
        console.log("first nananan");
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Not authorised.",
        });
      }

      if (payload.status == "reject") {
        const withdraw = await WithdrawModel.findOneAndUpdate(
          { _id: _id },
          withdraw_status,
          {
            new: true,
          }
        );
        return res.status(200).json({
          status: 200,
          success: true,
          data: withdraw,
          message: "Transactions reject successfully.",
        });
      } else if (payload.status == "approved") {
        console.log("approved");
        const user_id = withdrawData.user_id;
        const user = await User.findOne({ user_id: user_id});
        if (user) {
          let userAmount = user.amount + user.exposure_limit;
          if (userAmount < withdrawData.withdraw_amount) {
            return res.status(500).json({
              status: 500,
              success: true,
              message: "Insufficient balance.",
            });
          }
          const withdraw = await WithdrawModel.findOneAndUpdate(
            { _id: _id },
            withdraw_status,
            {
              new: true,
            }
          );
          let final_amount = user.amount - withdrawData.withdraw_amount;
          const updatedUser = await User.findOneAndUpdate(
            { user_id: user_id},
            {
              amount: final_amount,
              $inc: { total_withdraw_amount: withdrawData.withdraw_amount },
            },
            { new: true } // This option returns the modified document
          );
          return res.status(200).json({
            status: 200,
            success: true,
            message: "Transactions update successfully.",
            data: withdraw,
          });
        } else {
          return res.status(404).json({
            status: 404,
            success: true,
            message: "User not found.",
          });
        }
      } else {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Not ssss.",
        });
      }
    }
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}

async function UpdateDepositById(req, res) {
  const _id = req.params._id; // Assuming userId is a route parameter
  const payload = req.body;
  const deposit_status = { status: payload.status };
  try {
    const depositData = await DepositModel.findOne({ _id: _id});
    // Find deposits and withdrawals for the given user_id
    // Send the response with transactions and pagination details

    if (!depositData) {
      return res.status(404).json({
        status: 404,
        success: true,
        message: "Transactions not found.",
      });
    }

    if (depositData) {
      if (depositData.status !== "pending") {
        return res.status(401).json({
          status: 401,
          success: false,
          message: "Not authorised.",
        });
      }

      if (payload.status == "reject") {
        const deposit = await DepositModel.findOneAndUpdate(
          { _id: _id },
          deposit_status,
          {
            new: true,
          }
        );
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Transactions reject successfully.",
        });
      }

      const user_id = depositData.user_id;
      const user = await User.findOne({ user_id: user_id });
      let final_deposit_amount = 0;
      if (user) {
        const bonus = Number(depositData.bonus) || 0;
        const deposit_amount = Number(depositData.deposit_amount);

        const per_one_percent = bonus > 0 ? deposit_amount / 100 : 0;

        final_deposit_amount = per_one_percent * bonus + deposit_amount;

        const amount = final_deposit_amount + user.amount;

        const deposit = await DepositModel.findOneAndUpdate(
          { _id: _id },
          deposit_status,
          {
            new: true,
          }
        );
        const updatedUser = await User.findOneAndUpdate(
          { user_id: user_id },
          {
            amount: Number(amount),
            $inc: { total_deposit_amount: deposit.deposit_amount },
          },

          { new: true } // This option returns the modified document
        );
        return res.status(200).json({
          status: 200,
          success: true,
          message: "Transactions update successfully.",
          data: deposit,
        });
      } else {
        res.status(404).json({
          status: 404,
          success: true,
          message: "User not found.",
        });
      }
    }
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
}
async function GetTransactionsPl(req, res) {
  const user_id = req.params.user_id; // Assuming userId is a route parameter
  const page = req.query.page || 1; // Current page number from query parameter, default to 1 if not provided
  const pageSize = req.query.pageSize || 20; // Number of items per page from query parameter, default to 10 if not provided
  const type = req.query.type || 20; // Number of items per page from query parameter, default to 10 if not provided
  const username = req.query.username; // Assuming userId is a route parameter
  try {
    // Find deposits and withdrawals for the given user_id
    const deposits = await DepositModel.aggregate([
      { $match: { user_id, username, status: "approved" } },
      {
        $group: {
          _id: null,
          totalDeposits: { $sum: "$deposit_amount" },
        },
      },
    ]);

    const withdrawals = await WithdrawModel.aggregate([
      { $match: { user_id, username } },
      {
        $group: {
          _id: null,
          totalWithdrawals: { $sum: "$withdraw_amount" },
        },
      },
    ]);
    console.log(username, user_id, type);
    let rest_amount = 0;
    if (type === "user") {
      let user = await User.findOne({ username, user_id });
      if (!user) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "User not found.",
        });
      }
      rest_amount = Math.abs(user.amount - user.exposure_limit);
    } else {
      let admin = await Admin.findOne({ username, admin_id: user_id });
      if (!admin) {
        return res.status(404).json({
          status: 404,
          success: true,
          message: "Admin not found.",
        });
      }
      rest_amount = admin.amount;
    }
    // Calculate the total amount by subtracting withdrawals from deposits
    const totalDeposits = deposits.length > 0 ? deposits[0].totalDeposits : 0;
    const totalWithdrawals =
      withdrawals.length > 0 ? withdrawals[0].totalWithdrawals : 0;
    const totalAmount = totalWithdrawals - totalDeposits + rest_amount;

    // Now, totalAmount variable holds the total amount for the user

    // Send the response with transactions and pagination details
    res.status(200).json({
      status: 200,
      success: true,
      message: "Amount retrived successfully.",
      totalDeposits,
      totalWithdrawals,
      totalAmount,
    });
  } catch (error) {
    // Handle errors, log them, or return an appropriate response
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      status: 500,
      success: false,
      message: "Error fetching transactions.",
      error: error.message,
    });
  }
}

const GetTotalDepositAndWager = async (req, res) => {
  // let transactionSeason=mongoose.startSession();
  const { username, user_id } = req.body;
  try {
    if (!username || !user_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "Invalid req body.",
      });
    }

    let user = await User.findOne({ username: username, user_id: user_id,user_type:"bajivairent"});

    let totalWithdrawAmount = 0;
    let totalDepositAmount = 0;

    let casinoData = await CasinoModel.find({
      Username: username,
      UserType:"bajivairent",
      UserId: user_id,
      Status: "settled",
      ReturnStake: 0,
    });

    let sportData = await BetModel.find({
      username: username,
      user_id: user_id,
      result: "",
      rate: { $gt: 1.4 },
    });

    if (sportData.length == 0 || casinoData.length == 0) {
      return res.status(200).json({
        status: 200,
        success: false,
        data: {
          totalDeposit: totalDepositAmount,
          totalWithdraw: totalWithdrawAmount,
          totalWager: 0,
          wagerLeft: 0,
        },
        message: "Data retrieved successfully..",
      });
    }

    const allDeposit = await DepositModel.find({
      username: username,
      user_id: user_id,
      status: "approved",
    });
    const allWithdraw = await WithdrawModel.find({
      username: username,
      user_id: user_id,
      status: "approved",
    });

    const getTotalDepositAmount = () => {
      let totalDeposit = 0;
      for (let h = 0; h < allDeposit.length; h++) {
        let deposit = allDeposit[h];
        totalDeposit += deposit.deposit_amount;
      }
      return totalDeposit || 0;
    };
    const getTotalWithdrawAmount = () => {
      let totalWithdraw = 0;
      for (let h = 0; h < allWithdraw.length; h++) {
        let withdraw = allWithdraw[h];
        totalWithdraw += withdraw.withdraw_amount;
      }
      return totalWithdraw || 0;
    };

    const totalWagerOfCasino = () => {
      let totalWager = 0;
      for (let h = 0; h < casinoData.length; h++) {
        let casino = casinoData[h];
        totalWager += casino.Amount;
      }
      return totalWager || 0;
    };

    const totalWagerOfSport = () => {
      let totalWager = 0;
      for (let h = 0; h < sportData.length; h++) {
        let sport = sportData[h];
        totalWager += sport.Amount;
      }
      return totalWager || 0;
    };

    let totalCompletedWager = totalWagerOfCasino() + totalWagerOfSport();
    // console.log(getTurnOver(), totalWager());
    let wagerLeft = getTotalDepositAmount() - totalCompletedWager;
    console.log(wagerLeft);
    wagerLeft = wagerLeft > 0 ? wagerLeft : 0;
    // transactionSeason.emit()
    res.status(200).json({
      status: 200,
      success: false,
      data: {
        totalDeposit: totalDepositAmount || getTotalDepositAmount(),
        totalWithdraw: totalWithdrawAmount || getTotalWithdrawAmount(),
        totalCompletedWager: totalCompletedWager,
        totalWager: getTotalDepositAmount(),
        wagerLeft: wagerLeft,
      },
      message: "Data retrieved successfully.",
    });
  } catch (error) {
    // transactionSeason.abort()
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  GetAllWithdrawTransaction,
  GetAllDepositTransaction,
  GetWithdrawByUserId,
  GetDepositByUserId,
  GetTransactionsByUserId,
  CreateDepositTransaction,
  CreateWithdrawTransaction,
  GetDepositById,
  GetWithdrawById,
  UpdateWithdrawById,
  UpdateDepositById,
  GetTransactionsPl,
  GetTotalDepositAndWager,
};
