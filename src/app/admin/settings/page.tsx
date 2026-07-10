"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RefreshCw, Truck, Image, MessageSquare, Star, Info, Mail, Check, Tag, Plus, Trash2, Globe } from "lucide-react";

const tabs = [
  { id: "hero", label: "Hero", icon: Image },
  { id: "featured", label: "Featured", icon: Star },
  { id: "whyUs", label: "Why Us", icon: Info },
  { id: "testimonials", label: "Avis", icon: MessageSquare },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "delivery", label: "Livraison", icon: Truck },
  { id: "brands", label: "Marques", icon: Tag },
];

const defaultSettings = {
  featuredProductIds: [] as string[],
  hero: { title: "", subtitle: "" },
  featured: { title: "", subtitle: "" },
  whyUs: { title: "", subtitle: "", items: [] as { title: string; description: string; icon: string }[] },
  testimonials: { title: "", items: [] as { name: string; role: string; text: string; avatar: string }[] },
  newsletter: { title: "", subtitle: "" },
  delivery: { fee: 8, freeThreshold: 100 },
  brands: [] as { name: string; origin: string; logo: string }[],
};

export default function AdminSettings() {
  const [tab, setTab] = useState("featured");
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [allProducts, setAllProducts] = useState<{ _id: string; name: string; id: string }[]>([]);
  const [newBrand, setNewBrand] = useState({ name: "", origin: "", logo: "" });

  useEffect(() => {
    Promise.all([
      fetch("/api/site-settings").then((r) => r.json()),
      fetch("/api/products").then((r) => r.json()),
    ]).then(([s, prods]) => {
      if (s.hero) setSettings((prev) => ({ ...prev, ...s }));
      setAllProducts(prods.map((p: any) => ({ ...p, id: p._id || p.id })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleFeatured = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      featuredProductIds: prev.featuredProductIds.includes(id)
        ? prev.featuredProductIds.filter((x: string) => x !== id)
        : [...prev.featuredProductIds, id],
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const update = (section: string, key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [section]: { ...prev[section as keyof typeof prev], [key]: value } }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-slate-400" /></div>;

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }) => (
    <button onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-100"}`}>
      <Icon className="w-4 h-4" /> {label}
    </button>
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Paramètres du site</h1>
          <p className="text-slate-500 mt-1">Personnalisez le contenu de la page d&apos;accueil</p>
        </div>
        <button onClick={save} disabled={saving} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-40 transition-colors">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "Sauvegardé !" : "Sauvegarder"}
        </button>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2 pb-4 border-b border-slate-200">
        {tabs.map((t) => <TabButton key={t.id} {...t} />)}
      </div>

      <div className="mt-6 max-w-2xl space-y-4">
        {tab === "hero" && (
          <>
            <Field label="Titre"><input value={settings.hero.title} onChange={(e) => update("hero", "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Sous-titre"><textarea value={settings.hero.subtitle} onChange={(e) => update("hero", "subtitle", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 resize-none" /></Field>
          </>
        )}

        {tab === "featured" && (
          <>
            <Field label="Titre"><input value={settings.featured.title} onChange={(e) => setSettings((prev) => ({ ...prev, featured: { ...prev.featured, title: e.target.value } }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Sous-titre"><input value={settings.featured.subtitle} onChange={(e) => setSettings((prev) => ({ ...prev, featured: { ...prev.featured, subtitle: e.target.value } }))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Produits mis en avant">
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {allProducts.map((p) => (
                  <label key={p.id} onClick={() => toggleFeatured(p.id)} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${settings.featuredProductIds.includes(p.id) ? "bg-primary border-primary" : "border-slate-300"}`}>
                      {settings.featuredProductIds.includes(p.id) && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm text-slate-700">{p.name}</span>
                  </label>
                ))}
              </div>
            </Field>
          </>
        )}

        {tab === "whyUs" && (
          <>
            <Field label="Titre"><input value={settings.whyUs.title} onChange={(e) => update("whyUs", "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Sous-titre"><input value={settings.whyUs.subtitle} onChange={(e) => update("whyUs", "subtitle", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
          </>
        )}

        {tab === "newsletter" && (
          <>
            <Field label="Titre"><input value={settings.newsletter.title} onChange={(e) => update("newsletter", "title", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Sous-titre"><input value={settings.newsletter.subtitle} onChange={(e) => update("newsletter", "subtitle", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
          </>
        )}

        {tab === "delivery" && (
          <>
            <Field label="Frais de livraison (TND)"><input type="number" value={settings.delivery.fee} onChange={(e) => setSettings({ ...settings, delivery: { ...settings.delivery, fee: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
            <Field label="Livraison gratuite à partir de (TND)"><input type="number" value={settings.delivery.freeThreshold} onChange={(e) => setSettings({ ...settings, delivery: { ...settings.delivery, freeThreshold: Number(e.target.value) } })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" /></Field>
          </>
        )}

        {tab === "brands" && (
          <div className="space-y-4">
            <Field label="Ajouter une marque">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <input placeholder="Nom" value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
                  <input placeholder="Origine (pays)" value={newBrand.origin} onChange={(e) => setNewBrand({ ...newBrand, origin: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
                </div>
                <div className="flex gap-2">
                  <input placeholder="URL du logo" value={newBrand.logo} onChange={(e) => setNewBrand({ ...newBrand, logo: e.target.value })} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900" />
                  <button onClick={() => {
                    if (!newBrand.name.trim() || !newBrand.logo.trim()) return;
                    setSettings((prev) => ({
                      ...prev,
                      brands: [...prev.brands, { ...newBrand, name: newBrand.name.trim(), origin: newBrand.origin.trim(), logo: newBrand.logo.trim() }],
                    }));
                    setNewBrand({ name: "", origin: "", logo: "" });
                  }} className="flex items-center gap-2 shrink-0 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
              </div>
            </Field>

            {settings.brands.length === 0 ? (
              <p className="text-sm text-slate-400">Aucune marque. Ajoutez-en une ci-dessus.</p>
            ) : (
              <div className="grid gap-3">
                {settings.brands.map((brand, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3 rounded-lg border border-slate-200">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center">
                      {brand.logo ? (
                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain" />
                      ) : (
                        <Image className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{brand.name}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1"><Globe className="w-3 h-3" /> {brand.origin || "Non spécifié"}</p>
                    </div>
                    <button onClick={() => {
                      setSettings((prev) => ({ ...prev, brands: prev.brands.filter((_, j) => j !== i) }));
                    }} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "testimonials" && (
          <p className="text-sm text-slate-400">Les avis clients seront personnalisables prochainement.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
