import { connectDB } from "./mongodb";
import { ProductModel } from "./models/product";
import { UserModel } from "./models/user";
import bcrypt from "bcryptjs";
import { products } from "./products";

export async function seedDB() {
  await connectDB();

  const hashed = await bcrypt.hash("admin123", 10);
  await UserModel.findOneAndUpdate(
    { role: "admin" },
    { email: "oussemabraiek@gmail.com", password: hashed, role: "admin" },
    { upsert: true },
  );
  console.log("Admin user ensured (oussemabraiek@gmail.com / admin123)");

  for (const { id, ...rest } of products) {
    await ProductModel.findOneAndUpdate(
      { name: rest.name },
      { ...rest },
      { upsert: true },
    );
  }
  console.log(`${products.length} products seeded`);
}
