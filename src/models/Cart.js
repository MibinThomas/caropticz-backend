// models/Cart.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
  },
  offerPrice: {
    type: Number,
  },
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    items: [cartItemSchema],

    couponCode: {
      type: String,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
