import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { OrderModel } from "@/lib/models/order";
import { ProductModel } from "@/lib/models/product";

async function adjustStock(order: Record<string, unknown>, oldStatus: string, newStatus: string) {
  const confirmed = "confirmed";

  if (oldStatus !== confirmed && newStatus === confirmed) {
    // Confirming — decrement stock
    for (const item of order.items as { productId: string; quantity: number }[]) {
      const product = await ProductModel.findById(item.productId);
      if (product && (product.stock ?? 0) >= item.quantity) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
          inStock: (product.stock ?? 0) - item.quantity > 0,
        });
      } else if (product) {
        throw new Error(`Stock insuffisant pour "${product.name}" (${product.stock ?? 0} restant, ${item.quantity} requis)`);
      }
    }
  } else if (oldStatus === confirmed && newStatus !== confirmed) {
    // Un-confirming — restore stock
    for (const item of order.items as { productId: string; quantity: number }[]) {
      const product = await ProductModel.findById(item.productId);
      if (product) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
          inStock: true,
        });
      }
    }
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await OrderModel.findById(id).lean();
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const current = await OrderModel.findById(id).lean();
    if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const newStatus = body.status;
    if (newStatus && newStatus !== current.status) {
      await adjustStock(current, current.status, newStatus);
    }

    const order = await OrderModel.findByIdAndUpdate(id, body, { new: true }).lean();
    return NextResponse.json(order);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to update order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await OrderModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
