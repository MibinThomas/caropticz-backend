import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    title: {
      type: String,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["system", "booking", "promo"],
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries by userId & read status
notificationSchema.index({ userId: 1, read: 1 });

const notifications = mongoose.model("notifications", notificationSchema);
export default notifications;
