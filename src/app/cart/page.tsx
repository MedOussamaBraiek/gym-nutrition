"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, Check, Percent, CreditCard, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-store";

interface Settings {
  delivery: { fee: number; freeThreshold: number };
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal } = useCart();
  const [settings, setSettings] = useState<Settings>({ delivery: { fee: 8, freeThreshold: 100 } });
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", notes: "" });

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((d) => { if (d.delivery) setSettings(d); })
      .catch(() => {});
  }, []);

  const deliveryFee = subtotal >= settings.delivery.freeThreshold ? 0 : settings.delivery.fee;
  const discountAmount = couponDiscount > 0 ? (subtotal * couponDiscount) / 100 : 0;
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const applyCoupon = async () => {
    setCouponError("");
    if (!couponCode.trim()) return;
    try {
      const res = await fetch(`/api/coupons/verify?code=${encodeURIComponent(couponCode)}&subtotal=${subtotal}`);
      const data = await res.json();
      if (!res.ok) { setCouponError(data.error || "Code invalide"); return; }
      setCouponDiscount(data.value);
      setAppliedCoupon(data.code);
      setCouponCode("");
    } catch { setCouponError("Erreur de vérification"); }
  };

  const placeOrder = async () => {
    if (!form.name || !form.phone || !form.address) return;
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          subtotal,
          deliveryFee,
          discount: discountAmount,
          couponCode: appliedCoupon,
          total,
          customer: form,
        }),
      });
      if (!res.ok) throw new Error("Erreur");
      setPlaced(true);
      clearCart();
    } catch { alert("Erreur lors de la commande"); }
    setPlacing(false);
  };

  if (placed) {
    return (
      <div className="pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Commande Confirmée !</h1>
          <p className="text-white/50 mt-3">Merci {form.name} ! Nous vous contacterons bientôt pour confirmer votre commande.</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-primary font-medium hover:text-primary-light transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Continuer vos achats
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Mon Panier</h1>
        </motion.div>

        {items.length === 0 ? (
          <div className="mt-12 text-center py-20 bg-dark-lighter rounded-2xl border border-white/5">
            <ShoppingBag className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/50 text-lg">Votre panier est vide</p>
            <Link href="/products" className="inline-flex items-center gap-2 mt-4 text-primary font-medium hover:text-primary-light transition-colors">
              Découvrir nos produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div key={item.productId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="flex gap-4 bg-dark-lighter rounded-xl p-4 border border-white/5"
                >
                  <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-dark">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate">{item.name}</h3>
                    <p className="text-sm text-white/40">{item.weight}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">{item.price} TND</span>
                      <button onClick={() => removeItem(item.productId)} className="p-1 text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/5 transition-colors">
                        <Plus className="w-3 h-3" />
                      </button>
                      <span className="ml-auto text-sm text-white/60">{item.price * item.quantity} TND</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-dark-lighter rounded-xl border border-white/5 p-6 sticky top-28">
                <h2 className="font-semibold text-white mb-4">Résumé</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-white/60"><span>Sous-total</span><span>{subtotal} TND</span></div>
                  <div className="flex justify-between text-white/60">
                    <span>Livraison</span>
                    <span>{deliveryFee === 0 ? <span className="text-green-400">Gratuite</span> : `${deliveryFee} TND`}</span>
                  </div>
                  {subtotal > 0 && subtotal < settings.delivery.freeThreshold && (
                    <p className="text-xs text-white/30">Plus que {settings.delivery.freeThreshold - subtotal} TND pour la livraison gratuite</p>
                  )}
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-green-400"><span>Réduction ({appliedCoupon})</span><span>-{discountAmount} TND</span></div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-white text-base">
                    <span>Total</span><span>{total} TND</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Code promo"
                      className="flex-1 px-3 py-2 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                    <button onClick={applyCoupon} disabled={!couponCode.trim()}
                      className="px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark disabled:opacity-40 transition-colors">
                      <Percent className="w-4 h-4" />
                    </button>
                  </div>
                  {couponError && <p className="text-red-400 text-xs mt-1">{couponError}</p>}
                  {appliedCoupon && <p className="text-green-400 text-xs mt-1">Code {appliedCoupon} appliqué !</p>}
                </div>

                <div className="mt-6 space-y-3">
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nom complet *"
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Téléphone *"
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email (optionnel)"
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                  <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Adresse *"
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Ville"
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none" />
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notes (optionnel)" rows={2}
                    className="w-full px-3 py-2.5 rounded-lg bg-dark border border-white/10 text-sm text-white placeholder-white/30 focus:border-primary focus:outline-none resize-none" />

                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <CreditCard className="w-4 h-4" />
                    Paiement à la livraison
                  </div>

                  <button onClick={placeOrder} disabled={placing || !form.name || !form.phone || !form.address}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-40 transition-colors">
                    {placing ? "Traitement..." : `Commander (${total} TND)`}
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-white/30">
                  <Truck className="w-4 h-4" />
                  Livraison 24-48h dans toute la Tunisie
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
