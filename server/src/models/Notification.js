import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["auction_approved", "auction_rejected", "system"],
      default: "system",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedAuctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);