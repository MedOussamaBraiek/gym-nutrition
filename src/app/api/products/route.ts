import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/product";
import { seedDB } from "@/lib/seed";

export async function GET() {
  try {
    await connectDB();
    const products = await ProductModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (e) {
    console.error("GET /api/products error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const product = await ProductModel.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (e) {
    console.error("POST /api/products error:", e);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
