import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/lib/models/user";
import { seedDB } from "@/lib/seed";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectDB();

    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      await seedDB();
    }

    const { email, password } = await req.json();
    const query = email ? { email } : { role: "admin" };
    const user = await UserModel.findOne(query);
    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 401 });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });

    return NextResponse.json({ success: true, token: "admin-authenticated" });
  } catch (e) {
    console.error("POST /api/auth/login error:", e);
    const message = e instanceof Error ? e.message : "Erreur de connexion";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
