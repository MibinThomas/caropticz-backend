import mongoose from "mongoose";

const referralSchema = new mongoose.Schema(
  {
    referrerUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    referredUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    referralCode: {
      type: String,
      unique: true,
    },
    rewardAmount: {
      type: Number,
    },
    rewardStatus: {
      type: {
        type: String,
      },
      enum: ["pending", "credited"],
      default: "pending",
    },
  },
  { timestamps: true }
);
const referrals = mongoose.model("referrals", referralSchema);

export default referrals;
