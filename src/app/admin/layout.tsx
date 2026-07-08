"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, ChevronLeft, ChevronRight, Dumbbell, LogOut, Key, Settings, Percent, Menu, X } from "lucide-react";
import { AdminProvider } from "@/lib/admin-store";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Codes Promo", icon: Percent },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (pathname.startsWith("/admin/login")) {
      setAuthed(true);
    } else if (token) {
      setAuthed(true);
    } else {
      router.push("/admin/login");
    }
    setChecked(true);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  const changePassword = async () => {
    setPwMsg("");
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur");
      }
      setPwMsg("Mot de passe modifié avec succès");
      setCurrentPw("");
      setNewPw("");
    } catch (e: unknown) {
      setPwMsg(e instanceof Error ? e.message : "Erreur");
    } finally {
      setPwLoading(false);
    }
  };

  if (!checked) return null;
  if (!authed) return null;
  if (pathname.startsWith("/admin/login")) return <>{children}</>;

  return (
    <AdminProvider>
      <div className="min-h-screen flex bg-slate-50">
        <aside
          className={`hidden lg:flex flex-col sticky top-0 h-screen bg-white border-r border-slate-200 transition-all duration-300 shrink-0 ${
            collapsed ? "w-16" : "w-60"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            {!collapsed && (
              <Link href="/admin" className="flex items-center gap-2 font-bold text-slate-900">
                <Dumbbell className="w-5 h-5 text-primary" />
                <span>Admin</span>
              </Link>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          <nav className="flex-1 py-4 px-2 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 px-2 py-3 space-y-1">
            {!collapsed && (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all"
              >
                <Key className="w-4 h-4" />
                <span>Changer mot de passe</span>
              </button>
            )}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all"
              title={collapsed ? "Déconnexion" : undefined}
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!collapsed && <span>Déconnexion</span>}
            </button>
            {!collapsed && (
              <Link href="/" className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                &larr; Retour au site
              </Link>
            )}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden flex items-center justify-between h-14 px-4 border-b border-slate-200 bg-white">
            <div className="flex items-center gap-3">
              <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <Menu className="w-5 h-5" />
              </button>
              <span className="font-semibold text-sm text-slate-900">Admin</span>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {collapsed && (
            <div className="lg:hidden fixed inset-0 z-40 bg-black/30" onClick={() => setCollapsed(false)}>
              <div className="fixed inset-y-0 left-0 z-50 w-60 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between h-14 px-4 border-b border-slate-200">
                  <span className="font-bold text-slate-900">Navigation</span>
                  <button onClick={() => setCollapsed(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="py-4 px-2 space-y-1">
                  {navItems.map((item) => {
                    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setCollapsed(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                          active ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-slate-200 px-2 py-3 space-y-1">
                  <button onClick={() => { setShowPasswordModal(true); setCollapsed(false); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-all">
                    <Key className="w-4 h-4" /> Changer mot de passe
                  </button>
                  <button onClick={() => { logout(); setCollapsed(false); }} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                  <Link href="/" onClick={() => setCollapsed(false)} className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                    &larr; Retour au site
                  </Link>
                </div>
              </div>
            </div>
          )}
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-slate-900">Changer le mot de passe</h3>
            <div className="mt-4 space-y-3">
              <input
                type="password"
                placeholder="Mot de passe actuel"
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <input
                type="password"
                placeholder="Nouveau mot de passe"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              {pwMsg && (
                <p className={`text-sm px-3 py-2 rounded-lg ${pwMsg.includes("succès") ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {pwMsg}
                </p>
              )}
              <button
                onClick={changePassword}
                disabled={pwLoading || !currentPw || !newPw}
                className="w-full py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {pwLoading ? "En cours..." : "Modifier"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminProvider>
  );
}
