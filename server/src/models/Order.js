import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    province: { type: String, default: "" },
    district: { type: String, default: "" },
    ward: { type: String, default: "" },
    detail: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    auctionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: true,
      unique: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    finalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "AWAITING_PAYMENT",
        "PAID",
        "PREPARING_HANDOVER",
        "HANDOVER_SCHEDULED",
        "SHIPPING",
        "COMPLETED",
        "CANCELLED",
        "DISPUTED",
      ],
      default: "AWAITING_PAYMENT",
    },
    handoverMethod: {
      type: String,
      enum: ["SHIPPING", "MEETUP"],
      default: "SHIPPING",
    },
    shippingAddress: {
      type: addressSchema,
      default: () => ({}),
    },
    carrier: {
      type: String,
      default: "",
    },
    trackingCode: {
      type: String,
      default: "",
    },
    meetupLocation: {
      type: String,
      default: "",
    },
    meetupTime: {
      type: Date,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
    paidAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);