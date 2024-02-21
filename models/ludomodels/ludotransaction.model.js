const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  method_url: {
    type: String

  },
  transaction_id: {
    type: String,
    required: true,
    unique: true,
  },
  initiated_at: {
    type: String,

  },
  username: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["approved", "reject", "pending"],
    required: true,
    default: "pending",
  },
  updated_at: {
    type: String
  },
  slip: {
    type: String,
  },
  payable: {
    type: Number,
    required: true,
  },
  after_transaction: {
    type: Number,
    required: true,
  },
  wallet_amount: {
    type: Number,
    required: true,
  },
  admin_response: {
    type: String,
  },
  user_details: {
    type: Array,
  },
  type: { type: String, enum: ["deposit", "withdrawal"], required: true },
    created_at:{ type: String, default: "" ,required:true},
    updated_at:{ type: String, default: "" , required:true}
});

const TransactionLudo = mongoose.model("TransactionLudo", transactionSchema);

module.exports = TransactionLudo;



