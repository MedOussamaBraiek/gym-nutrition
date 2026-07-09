import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return NextResponse.json({ error: "SMTP_USER or SMTP_PASS not set" }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      requireTLS: true,
      auth: { user, pass },
    });

    await transporter.sendMail({
      to: user,
      from: user,
      subject: "Test SMTP - Tunisia Nutrition",
      text: "Si tu reçois ce mail, SMTP fonctionne !",
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : String(e),
      code: e instanceof Error && "code" in e ? (e as any).code : undefined,
    }, { status: 500 });
  }
}
