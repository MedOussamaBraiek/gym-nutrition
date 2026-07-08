import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  goal: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  benefits: [{ type: String }],
  flavor: String,
  weight: { type: String, default: "" },
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  badge: { type: String, enum: ["new", "sale", "best-seller"] },
  createdAt: { type: Date, default: Date.now },
});

export const ProductModel = mongoose.models.Product || mongoose.model("Product", productSchema);