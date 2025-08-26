// src/routes/userRoutes.js

import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    buildingName: String,
    street: String,
    area: String,
    city: { type: String, default: "Dubai" },
    emirate: {
      type: String,
      enum: [
        "Abu Dhabi",
        "Dubai",
        "Sharjah",
        "Ajman",
        "Fujairah",
        "Ras Al Khaimah",
        "Umm Al Quwain"
      ],
    },
    poBox: String,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
    },
    otpExpireAt: {
      type: Date,
    },

    isVerified: { type: Boolean, default: false },

    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "staff1", "staff2"],
      default: "user",
    },
    address: [addressSchema],
    referralCode: String,
    referredBy: String,
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

const users = mongoose.model("users", userSchema);

export default users;
