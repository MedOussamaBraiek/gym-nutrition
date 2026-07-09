import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NewsletterModel } from "@/lib/models/newsletter";
import { sendNewsletterNotification, sendNewsletterConfirmation } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

    await connectDB();

    const exists = await NewsletterModel.findOne({ email });
    if (exists) return NextResponse.json({ message: "Déjà inscrit" });

    await NewsletterModel.create({ email });

    try {
      await sendNewsletterNotification(email);
    } catch {
      // non-critical
    }

    try {
      await sendNewsletterConfirmation(email);
    } catch {
      // non-critical
    }

    return NextResponse.json({ message: "Inscription réussie" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
