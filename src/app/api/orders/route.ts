import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models/order";
import { sendOrderNotification, sendOrderConfirmation } from "@/lib/email";

export async function GET() {
  try {
    await connectDB();
    const orders = await OrderModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const order = await OrderModel.create(body);
    const obj = order.toObject();
    try {
      await sendOrderNotification(obj);
    } catch {
      // non-critical
    }
    try {
      await sendOrderConfirmation(obj);
    } catch {
      // non-critical
    }
    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
