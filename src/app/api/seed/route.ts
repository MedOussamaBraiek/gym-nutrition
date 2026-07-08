import { NextResponse } from "next/server";
import { seedDB } from "@/lib/seed";

export async function POST() {
  try {
    await seedDB();
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
