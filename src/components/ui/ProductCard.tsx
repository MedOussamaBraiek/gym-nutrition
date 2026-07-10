"use client";

import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { Product } from "@/lib/products";
import { useCart } from "@/lib/cart-store";
import { getStockLabel } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
}

const badges = {
  "best-seller": { label: "Best-seller", class: "bg-primary text-white" },
  new: { label: "Nouveau", class: "bg-blue-500 text-white" },
  sale: { label: "Promo", class: "bg-amber-500 text-white" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      weight: product.weight,
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block bg-dark-lighter rounded-2xl border border-white/5 overflow-hidden hover:border-primary/30 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] transition-all duration-500"
    >
      <div className="relative aspect-square overflow-hidden bg-dark">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
              badges[product.badge].class
            }`}
          >
            {badges[product.badge].label}
          </span>
        )}

        {discount > 0 && (
          <span className="absolute top-3 right-3 z-10 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
            -{discount}%
          </span>
        )}

        {(() => {
          const s = product.stock;
          const inStock = s !== undefined ? s > 0 : product.inStock;
          return !inStock ? (
            <div className="absolute inset-0 z-10 bg-black/60 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">Rupture de stock</span>
            </div>
          ) : null;
        })()}
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-full">
            {product.category}
          </span>
          <span className="text-xs text-white/30">{product.brand}</span>
        </div>

        <h3 className="mt-2 font-semibold text-white group-hover:text-primary-light transition-colors line-clamp-1">
          {product.name}
        </h3>

        <p className="mt-1 text-sm text-white/40 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary group-hover:text-primary-light transition-colors">
              {product.price} TND
            </span>
            {product.originalPrice && (
              <span className="text-sm text-white/30 line-through">
                {product.originalPrice} TND
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={(() => { const s = product.stock; const inStock = s !== undefined ? s > 0 : product.inStock; return !inStock; })()}
            className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Ajouter au panier"
          >
            <ShoppingCart className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">{product.weight}</span>
            <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${(() => {
              const s = product.stock;
              if (s !== undefined) {
                if (s === 0) return "bg-red-500/20 text-red-400";
                if (s <= 5) return "bg-amber-500/20 text-amber-400";
                if (s <= 20) return "bg-blue-500/20 text-blue-400";
                return "bg-emerald-500/20 text-emerald-400";
              }
              return product.inStock ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400";
            })()}`}>
              {getStockLabel(product.stock, product.inStock)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
            <span className="text-xs text-white/40">5.0</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
