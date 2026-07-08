import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, default: "admin@nutrition.tn" },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

export const UserModel = mongoose.models.User || mongoose.model("User", userSchema);