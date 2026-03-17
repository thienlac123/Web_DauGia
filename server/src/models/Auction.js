import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    startPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    minBidStep: {
      type: Number,
      default: 1000,
      min: 1,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    highestBidderId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
winnerId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
    status: {
      type: String,
      enum: ["upcoming", "active", "ended", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);