import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SiteSettingsModel } from "@/lib/models/site-settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await SiteSettingsModel.findOne();
    if (!settings) {
      settings = await SiteSettingsModel.create({
        brands: [
          { name: "Olimp", logo: "https://housenutrition.tn/storage/uploads/brands/images/scitec.png-6863bc2e0bd79.png", origin: "Pologne" },
          { name: "BioTechUSA", logo: "https://housenutrition.tn/storage/uploads/brands/images/BIOTECHUSA_1.png-69ca8c49d4735.png", origin: "USA" },
          { name: "WeightWorld", logo: "https://housenutrition.tn/storage/uploads/brands/images/universal.webp-663f3d4a2cf02.webp", origin: "UK" },
          { name: "Kevin Levrone", logo: "https://housenutrition.tn/storage/uploads/brands/images/logo__3_-removebg-preview.webp-677e895448c8a.webp", origin: "USA" },
          { name: "SFD", logo: "https://housenutrition.tn/storage/uploads/brands/images/animal.webp-663f40d543c36.webp-691ee74b7d208.webp", origin: "France" },
          { name: "MuscleTech", logo: "https://housenutrition.tn/storage/uploads/brands/images/logo.png-68c683a976c4e.png", origin: "USA" },
          { name: "ERIC FAVRE", logo: "https://housenutrition.tn/storage/uploads/brands/images/image-Photoroom%20(12).png-6921b5ba0a0da.png", origin: "France" },
        ],
      });
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
      settings = await SiteSettingsModel.create({
        ...body,
        brands: body.brands || [
          { name: "Olimp", logo: "https://housenutrition.tn/storage/uploads/brands/images/scitec.png-6863bc2e0bd79.png", origin: "Pologne" },
          { name: "BioTechUSA", logo: "https://housenutrition.tn/storage/uploads/brands/images/BIOTECHUSA_1.png-69ca8c49d4735.png", origin: "USA" },
          { name: "WeightWorld", logo: "https://housenutrition.tn/storage/uploads/brands/images/universal.webp-663f3d4a2cf02.webp", origin: "UK" },
          { name: "Kevin Levrone", logo: "https://housenutrition.tn/storage/uploads/brands/images/logo__3_-removebg-preview.webp-677e895448c8a.webp", origin: "USA" },
          { name: "SFD", logo: "https://housenutrition.tn/storage/uploads/brands/images/animal.webp-663f40d543c36.webp-691ee74b7d208.webp", origin: "France" },
          { name: "MuscleTech", logo: "https://housenutrition.tn/storage/uploads/brands/images/logo.png-68c683a976c4e.png", origin: "USA" },
          { name: "ERIC FAVRE", logo: "https://housenutrition.tn/storage/uploads/brands/images/image-Photoroom%20(12).png-6921b5ba0a0da.png", origin: "France" },
        ],
      });
    } else {
      Object.assign(settings, body);
      settings.markModified("hero");
      settings.markModified("featured");
      settings.markModified("whyUs");
      settings.markModified("testimonials");
      settings.markModified("newsletter");
      settings.markModified("delivery");
      settings.markModified("contact");
      settings.markModified("brands");
      await settings.save();
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
