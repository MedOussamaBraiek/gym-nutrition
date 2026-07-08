"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, RefreshCw, Eye, X, Trash2, Check } from "lucide-react";

interface Order {
  _id: string;
  items: { name: string; quantity: number; price: number }[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  customer: { name: string; phone: string; email: string; address: string; city: string; notes: string };
  status: string;
  createdAt: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    setOrders(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSelected(null);
    setUpdating(null);
    fetchOrders();
  };

  const deleteOrder = async (id: string) => {
    await fetch(`/api/orders/${id}`, { method: "DELETE" });
    setDeleteConfirm(null);
    setSelected(null);
    fetchOrders();
  };

  const statusColor: Record<string, string> = {
    pending: "bg-amber-50 text-amber-600 border-amber-200",
    confirmed: "bg-blue-50 text-blue-600 border-blue-200",
    shipped: "bg-purple-50 text-purple-600 border-purple-200",
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-200",
    cancelled: "bg-red-50 text-red-600 border-red-200",
  };

  const statusLabel: Record<string, string> = {
    pending: "En attente", confirmed: "Confirmée", shipped: "Expédiée", delivered: "Livrée", cancelled: "Annulée",
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
        <p className="text-slate-500 mt-1">{orders.length} commande{orders.length !== 1 ? "s" : ""}</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : orders.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <ShoppingCart className="w-7 h-7 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">Aucune commande</h3>
          <p className="text-slate-400 text-sm mt-2">Les commandes apparaîtront ici.</p>
        </motion.div>
      ) : (
        <div className="mt-6 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Articles</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Statut</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">{o.customer.name}</p>
                      <p className="text-xs text-slate-400">{o.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 hidden sm:table-cell">{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{o.total} TND</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">{new Date(o.createdAt).toLocaleDateString("fr-TN")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor[o.status] || statusColor.pending}`}>
                        {statusLabel[o.status] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setSelected(o)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Détails de la commande</h3>
              <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Client</span><span className="font-medium text-slate-900">{selected.customer.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Téléphone</span><span className="text-slate-900">{selected.customer.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Adresse</span><span className="text-slate-900">{selected.customer.address}{selected.customer.city ? `, ${selected.customer.city}` : ""}</span></div>
              <div className="flex justify-between items-center"><span className="text-slate-500">Statut</span>
                <select
                  value={selected.status}
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                  disabled={updating === selected._id}
                  className="text-sm px-2 py-1 rounded-lg border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="pending">En attente</option>
                  <option value="confirmed">Confirmée</option>
                  <option value="shipped">Expédiée</option>
                  <option value="delivered">Livrée</option>
                  <option value="cancelled">Annulée</option>
                </select>
              </div>
              <button onClick={() => setDeleteConfirm(selected._id)} className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 transition-colors">
                <Trash2 className="w-3 h-3" /> Supprimer cette commande
              </button>
              <div className="border-t border-slate-100 pt-3">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Articles</p>
                {selected.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-slate-700 py-1">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{item.price * item.quantity} TND</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 pt-3 space-y-1">
                <div className="flex justify-between text-slate-500"><span>Sous-total</span><span>{selected.subtotal} TND</span></div>
                <div className="flex justify-between text-slate-500"><span>Livraison</span><span>{selected.deliveryFee === 0 ? "Gratuite" : `${selected.deliveryFee} TND`}</span></div>
                {selected.discount > 0 && <div className="flex justify-between text-green-500"><span>Réduction</span><span>-{selected.discount} TND</span></div>}
                <div className="flex justify-between font-bold text-slate-900 pt-1"><span>Total</span><span>{selected.total} TND</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center px-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Supprimer cette commande ?</h3>
            <p className="text-sm text-slate-500 mt-2">Cette action est irréversible.</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">Annuler</button>
              <button onClick={() => deleteOrder(deleteConfirm)} className="px-5 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
