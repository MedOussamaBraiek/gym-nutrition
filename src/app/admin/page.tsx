"use client";

import { motion } from "framer-motion";
import { DollarSign, AlertTriangle, TrendingUp, Package } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";

export default function AdminDashboard() {
  const { totalProducts, totalStock, totalValue, products } = useAdmin();
  const outOfStock = totalProducts - totalStock;

  const stats = [
    { label: "Total Produits", value: totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "En Stock", value: totalStock, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Rupture de Stock", value: outOfStock, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Valeur Stock (TND)", value: `${totalValue}`, icon: DollarSign, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  const recentProducts = products.slice(0, 5);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Vue d&apos;ensemble de votre boutique</p>
      </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Produits Récents</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {recentProducts.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="px-5 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Package className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-400">{p.category} — {p.brand}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  p.inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                }`}>
                  {p.inStock ? "En stock" : "Rupture"}
                </span>
                <span className="text-sm font-semibold text-slate-900">{p.price} TND</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
