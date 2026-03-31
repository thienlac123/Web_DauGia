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

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    avatar: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: addressSchema,
      default: () => ({}),
    },
    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);