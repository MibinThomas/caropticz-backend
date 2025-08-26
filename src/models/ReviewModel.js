import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const reviews = mongoose.model("reviews", reviewSchema);
export default reviews;
