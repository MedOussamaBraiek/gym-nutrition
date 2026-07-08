import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/lib/models/site-settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettingsModel.findOne();
    if (!settings) {
      settings = await SiteSettingsModel.create({});
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    let settings = await SiteSettingsModel.findOne();
    if (!settings) {
      settings = await SiteSettingsModel.create(body);
    } else {
      Object.assign(settings, body);
      settings.markModified("hero");
      settings.markModified("featured");
      settings.markModified("whyUs");
      settings.markModified("testimonials");
      settings.markModified("newsletter");
      settings.markModified("delivery");
      settings.markModified("contact");
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
