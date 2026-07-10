"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart,
  Check,
  Star,
  ArrowLeft,
  Package,
  Shield,
  Truck,
  Clock,
} from "lucide-react";
import { useProducts } from "@/lib/use-products";
import { useCart } from "@/lib/cart-store";
import { getStockLabel } from "@/lib/stock";
import ProductCard from "@/components/ui/ProductCard";
import type { Product } from "@/lib/products";

export default function ProductDetailClient({ initialProduct }: { initialProduct: Product | null }) {
  const params = useParams();
  const { products } = useProducts();
  const { addItem } = useCart();

  // Use the server-provided product, fallback to one from the full list
  const product =
    initialProduct || products.find((p) => p.id === params.id);

  if (!product && products.length > 0) notFound();
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux produits
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="aspect-square rounded-3xl relative overflow-hidden bg-dark-lighter"
          >
            <div className="absolute inset-0 bg-black/30 z-0" />
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}

            {product.badge && (
              <span className="absolute top-4 left-4 z-10 bg-primary text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                {product.badge === "best-seller"
                  ? "Best-seller"
                  : product.badge === "new"
                  ? "Nouveau"
                  : "Promo"}
              </span>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
              {product.category}
            </span>
            <span className="inline-block ml-2 text-sm text-white/30">
              {product.brand}
            </span>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="text-sm text-white/40">(24 avis)</span>
            </div>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-primary">
                {product.price} TND
              </span>
              {product.originalPrice && (
                <span className="text-xl text-white/30 line-through">
                  {product.originalPrice} TND
                </span>
              )}
            </div>

            <p className="mt-6 text-white/60 leading-relaxed text-lg">
              {product.description}
            </p>

            {product.flavor && (
              <div className="mt-6">
                <span className="text-sm font-semibold text-white/80">Parfums:</span>
                <span className="ml-2 text-white/60">{product.flavor}</span>
              </div>
            )}

            <div className="mt-2">
              <span className="text-sm font-semibold text-white/80">Poids:</span>
              <span className="ml-2 text-white/60">{product.weight}</span>
            </div>

            <div className="mt-4 flex items-center gap-2 text-sm">
              {(() => {
                const s = product.stock;
                const label = getStockLabel(s, product.inStock);
                const inStock = s !== undefined ? s > 0 : product.inStock;
                return inStock ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className={`font-medium ${(() => {
                      if (s !== undefined) {
                        if (s <= 5) return "text-amber-400";
                        if (s <= 20) return "text-blue-400";
                        return "text-emerald-400";
                      }
                      return "text-green-400";
                    })()}`}>
                      {label}
                    </span>
                  </>
                ) : (
                  <span className="text-red-400 font-medium">{label}</span>
                );
              })()}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-white/10 rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-white/60 hover:bg-white/5 transition-colors text-lg font-medium"
                >
                  -
                </button>
                <span className="px-4 py-3 text-white font-semibold min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-white/60 hover:bg-white/5 transition-colors text-lg font-medium"
                >
                  +
                </button>
              </div>
              <button onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, originalPrice: product.originalPrice, image: product.image, weight: product.weight, quantity })} className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3.5 rounded-full font-semibold hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25">
                <ShoppingCart className="w-5 h-5" />
                Ajouter au Panier
              </button>
            </div>

            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/5">
              {[
                { icon: Truck, label: "Livraison 24-48h" },
                { icon: Shield, label: "100% Authentique" },
                { icon: Package, label: "Emballage Soigné" },
                { icon: Clock, label: "Paiement à la Livraison" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                  <span className="text-xs text-white/40">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-2">Bienfaits</h3>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {product.benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-3 bg-dark-lighter rounded-xl px-4 py-3 border border-white/5"
              >
                <Check className="w-5 h-5 text-primary shrink-0" />
                <span className="text-white/70">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {related.length > 0 && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">
              Produits Similaires
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                >
                  <ProductCard product={p} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
