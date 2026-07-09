import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ContactModel } from "@/lib/models/contact";
import { sendContactNotification } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    await connectDB();
    await ContactModel.create({ name, email, subject, message });

    try {
      await sendContactNotification(name, email, subject, message);
    } catch {
      // non-critical
    }

    return NextResponse.json({ message: "Message envoyé avec succès" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
