import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: ["VNPAY"],
      default: "VNPAY",
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    txnRef: {
      type: String,
      required: true,
      unique: true,
    },
    bankCode: {
      type: String,
      default: "",
    },
    transactionNo: {
      type: String,
      default: "",
    },
    responseCode: {
      type: String,
      default: "",
    },
    payDate: {
      type: String,
      default: "",
    },
    rawData: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);