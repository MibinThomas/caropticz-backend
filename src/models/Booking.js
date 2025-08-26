import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    service: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    // serviceId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "services",
    // },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: false },
    rescheduledDate: { type: Date }, // New booking date (if rescheduled)
    rescheduledTimeSlot: { type: String }, // New time slot (if rescheduled)
    status: {
      type: String,
      enum: ["pending", "confirmed", "rescheduled", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    assignedTechnician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    address: { type: String, required: false },
  },
  { timestamps: true }
);

const bookings = mongoose.model("bookings", bookingSchema);

export default bookings;
