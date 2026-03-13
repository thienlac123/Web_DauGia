import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    startPrice: {
      type: Number,
      required: true
    },
    currentPrice: {
      type: Number,
      required: true
    },
    minBidStep: {
      type: Number,
      default: 1000
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Auction", auctionSchema);