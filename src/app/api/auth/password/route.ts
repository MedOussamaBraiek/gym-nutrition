import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/user";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { currentPassword, newPassword } = await req.json();

    const user = await UserModel.findOne({ role: "admin" });
    if (!user) return NextResponse.json({ error: "No admin user found" }, { status: 401 });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) return NextResponse.json({ error: "Mot de passe actuel incorrect" }, { status: 401 });

    const hashed = await bcrypt.hash(newPassword, 10);
    await UserModel.updateOne({ role: "admin" }, { password: hashed });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
