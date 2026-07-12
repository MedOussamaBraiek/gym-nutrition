import mongoose from "mongoose";

const siteSettingsSchema = new mongoose.Schema({
  featuredProductIds: [{ type: String }],
  hero: {
    title: { type: String, default: "Boostez Vos Performances avec des Produits 100% Authentiques" },
    subtitle: { type: String, default: "Découvrez notre gamme de compléments nutritionnels de qualité supérieure. Livraison rapide dans toute la Tunisie." },
  },
  featured: {
    title: { type: String, default: "Nos Produits les Plus Populaires" },
    subtitle: { type: String, default: "Des milliers de clients tunisiens nous font confiance." },
  },
  whyUs: {
    title: { type: String, default: "Pourquoi Nous Choisir ?" },
    subtitle: { type: String, default: "La référence en nutrition sportive en Tunisie." },
    items: [
      {
        title: String,
        description: String,
        icon: { type: String, default: "Shield" },
      },
    ],
  },
  testimonials: {
    title: { type: String, default: "Ce que disent nos clients" },
    items: [
      {
        name: String,
        role: String,
        text: String,
        avatar: { type: String, default: "" },
      },
    ],
  },
  newsletter: {
    title: { type: String, default: "Restez Informé" },
    subtitle: { type: String, default: "Soyez les premiers informés" },
  },
  delivery: {
    fee: { type: Number, default: 8 },
    freeThreshold: { type: Number, default: 100 },
  },
  contact: {
    email: { type: String, default: "tunisianutrition@gmail.com" },
    phone: { type: String, default: "+216 27 804 998" },
    whatsapp: { type: String, default: "+216 27 804 998" },
    address: { type: String, default: "Monastir, Tunisie" },
  },
  brands: [{
    name: { type: String, default: "" },
    origin: { type: String, default: "" },
    logo: { type: String, default: "" },
  }],
});

export const SiteSettingsModel =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", siteSettingsSchema);
