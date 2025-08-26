import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bookings",
    },
    amount: {
      type: Number,
    },
    method: {
      type: String,
      enum: ["card", "upi", "cod"],
    },
    transactionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    gatewayResponse: Object,
  },
  { timestamps: true }
);

const payments = mongoose.model("payments", paymentSchema);
export default payments;
