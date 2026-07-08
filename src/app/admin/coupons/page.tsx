"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, RefreshCw, Percent, Tag } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "percentage", value: 10, minOrder: 0, maxUses: 0, active: true, expiresAt: "" });

  const fetchCoupons = async () => {
    const res = await fetch("/api/coupons");
    setCoupons(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchCoupons(); }, []);

  const addCoupon = async () => {
    if (!form.code.trim()) return;
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, expiresAt: form.expiresAt || undefined }),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ code: "", type: "percentage", value: 10, minOrder: 0, maxUses: 0, active: true, expiresAt: "" });
      fetchCoupons();
    }
  };

  const deleteCoupon = async (id: string) => {
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    fetchCoupons();
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Codes Promo</h1>
          <p className="text-slate-500 mt-1">{coupons.length} code{coupons.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Code</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Type</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Valeur</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Min</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Utilisé</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Statut</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-900">{c.code}</td>
                  <td className="px-4 py-3 text-slate-600 hidden sm:table-cell capitalize">{c.type === "percentage" ? "%" : "TND"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.type === "percentage" ? `${c.value}%` : `${c.value} TND`}</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{c.minOrder} TND</td>
                  <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{c.usedCount}{c.maxUses > 0 ? `/${c.maxUses}` : ""}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"}`}>
                      {c.active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => deleteCoupon(c._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <Tag className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-slate-900">Nouveau code promo</h3>
            </div>
            <div className="space-y-3">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Code" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900">
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (TND)</option>
              </select>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="Valeur" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
              <input type="number" value={form.minOrder} onChange={(e) => setForm({ ...form, minOrder: Number(e.target.value) })} placeholder="Minimum commande (0 = aucun)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
              <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} placeholder="Utilisations max (0 = illimité)" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="rounded border-slate-300 text-primary" />
                Actif
              </label>
              <button onClick={addCoupon} disabled={!form.code.trim()} className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-40 transition-colors">
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
