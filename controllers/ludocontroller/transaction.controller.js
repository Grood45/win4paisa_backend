const TransactionLudo = require("../../models/ludomodels/ludotransaction.model");

const { GetCurrentTime } = require("../utils/GetCurrentTime");

const GetSingleTransaction = async (req, res) => {
  try {
    const { username } = req.params;
    // Find the market document by ID
    const user = await TransactionLudo.findOne({ username });
    res.status(200).json({
      status: 200,
      success: true,
      message: "Transaction retrieved successfully",
      data: user,
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

const GetAllTransaction = async (req, res) => {
  try {
    const { username } = req.params;
    // Find the market document by ID
    const { page = 1, limit = 20, search = "", user_category } = req.query;
    const skip = (page - 1) * limit;

    // const {types}=req.body;
    let filter = {};
    if (username) {
      query.username = username;
    }
    if (method) {
      query.method = method;
    }
    if (type) {
      query.type = type;
    }

    const AllTranssaction = await TransactionLudo.find(filter)
      .skip(skip)
      .limit(parseInt(limit));
    const pagination = {
      totalUsers: AllTranssaction.length,
      totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };
    res.status(200).json({
      pagination,
      status: 200,
      success: true,
      message: "Transaction retrieved successfully",
      data: AllTranssaction,
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

const CreateTransaction = async (req, res) => {
  let payload = req.body;
  try {
    const timestamp = GetCurrentTime();
    payload = { ...payload, created_at: timestamp };
    let transaction = new TransactionLudo(payload);
    await transaction.save();
    res.status(200).json({
      status: 200,
      success: true,
      data: transaction,
      message: "Transaction added successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

const UpdateSingleTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the market document by ID
    const timestamp = GetCurrentTime();
    const payload = { ...req.body, updated_at: timestamp };
    const SingleTransaction = await TransactionLudo.findOneAndUpdate(
      { _id: id },
      payload,
      {
        new: true,
      }
    );

    res.status(200).json({
      status: 200,
      success: true,
      message: "Transaction details update successfully",
      data: SingleTransaction,
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

// const ToggleControlStatus = async (req, res) => {
//   try {
//     const { control_id } = req.params;
//     const { name } = req.body;
//     // Find the market document by ID
//     const control = await GlobalSetting.findOne({ control_id });

//     control[name] = control[name] == true ? false : true;

//     await control.save();

//     res.status(200).json({
//       status: 200,
//       success: true,
//       message: `${name} toggled successfully`,
//       data: control,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       status: 500,
//       success: false,
//       message: error.message,
//     });
//   }
// };

module.exports = {
  GetSingleTransaction,
  GetAllTransaction,
  CreateTransaction,
  UpdateSingleTransaction,
};
