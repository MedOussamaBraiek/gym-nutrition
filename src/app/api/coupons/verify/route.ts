import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CouponModel } from "@/lib/models/coupon";

export async function GET(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const code = url.searchParams.get("code")?.toUpperCase();
    const subtotal = Number(url.searchParams.get("subtotal")) || 0;

    if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

    const coupon = await CouponModel.findOne({ code, active: true });
    if (!coupon) return NextResponse.json({ error: "Code invalide" }, { status: 404 });

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Code expiré" }, { status: 400 });
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "Code épuisé" }, { status: 400 });
    }

    if (subtotal < coupon.minOrder) {
      return NextResponse.json({ error: `Minimum de ${coupon.minOrder} TND requis` }, { status: 400 });
    }

    return NextResponse.json({ code: coupon.code, value: coupon.value, type: coupon.type });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
