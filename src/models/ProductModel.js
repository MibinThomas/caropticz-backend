import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    description: String,
    category: String,
    subcategory: String,
    images: [String],
    price: Number,
    discount: Number,
    finalPrice: Number,
    stock: Number,
    specifications: { type: Map, of: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true }
);

const products = mongoose.model('products', productSchema)

export default products;