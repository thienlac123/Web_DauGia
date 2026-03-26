import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    // --- NHÓM THÔNG TIN SẢN PHẨM ---
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    images: {
      type: [String], // Lưu mảng URL hình ảnh
      default: [],
    },
    category: {
      type: String,
      default: "Khác",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    condition: {
      type: String,
      default: "Mới", // Ví dụ: Mới, Đã qua sử dụng
      trim: true,
    },

    // --- NHÓM GIÁ CẢ & ĐẤU GIÁ ---
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

    // --- NHÓM THỜI GIAN ---
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },

    // --- NHÓM NGƯỜI DÙNG LIÊN QUAN ---
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
     paymentStatus: {
      type: String,
      enum: ["unpaid", "pending","paid", "failed"],
      default: "unpaid",
    },

    // --- NHÓM TRẠNG THÁI HỆ THỐNG ---
    status: {
      type: String,
      enum: ["upcoming", "active", "ended", "cancelled"],
      default: "upcoming",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvalNote: {
      type: String,
      default: "",
    },
   
  },
  { timestamps: true } // Tự động tạo createdAt và updatedAt
);

export default mongoose.model("Auction", auctionSchema);