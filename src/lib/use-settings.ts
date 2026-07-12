"use client";

import { useState, useEffect } from "react";

interface SiteSettings {
  featuredProductIds: string[];
  hero: { title: string; subtitle: string };
  featured: { title: string; subtitle: string };
  whyUs: { title: string; subtitle: string; items: { title: string; description: string; icon: string }[] };
  testimonials: { title: string; items: { name: string; role: string; text: string; avatar: string }[] };
  newsletter: { title: string; subtitle: string };
  delivery: { fee: number; freeThreshold: number };
  contact: { email: string; phone: string; whatsapp: string; address: string };
}

const defaults: SiteSettings = {
  featuredProductIds: [],
  hero: { title: "Boostez Vos Performances avec des Produits 100% Authentiques", subtitle: "Découvrez notre gamme de compléments nutritionnels de qualité supérieure. Livraison rapide dans toute la Tunisie." },
  featured: { title: "Nos Produits les Plus Populaires", subtitle: "Des milliers de clients tunisiens nous font confiance." },
  whyUs: { title: "Pourquoi Nous Choisir ?", subtitle: "La référence en nutrition sportive en Tunisie.", items: [] },
  testimonials: { title: "Ce que disent nos clients", items: [] },
  newsletter: { title: "Restez Informé", subtitle: "Soyez les premiers informés" },
  delivery: { fee: 8, freeThreshold: 100 },
  contact: { email: "tunisianutrition@gmail.com", phone: "+216 27 804 998", whatsapp: "+216 27 804 998", address: "Monastir, Tunisie" },
};

let cache: SiteSettings | null = null;
let promise: Promise<SiteSettings> | null = null;
let cachedError: string | null = null;

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(cache || defaults);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    if (cache) { setSettings(cache); setLoading(false); return; }
    if (cachedError) { setError(cachedError); setLoading(false); return; }
    if (!promise) {
      promise = fetch("/api/site-settings").then(async (res) => {
        if (!res.ok) throw new Error("Erreur de chargement");
        return res.json();
      }).then((d) => {
        const merged = { ...defaults, ...d };
        cache = merged;
        return merged;
      }).catch((err) => {
        cachedError = err.message;
        throw err;
      });
    }
    promise.then(setSettings).then(() => setLoading(false)).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  return { settings, loading, error };
}
