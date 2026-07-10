export interface Product {
  _id?: string;
  id: string;
  name: string;
  nameAr?: string;
  category: string;
  brand: string;
  goal: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  benefits: string[];
  flavor?: string;
  weight: string;
  inStock: boolean;
  stock?: number;
  badge?: "new" | "sale" | "best-seller";
}

export const products: Product[] = [
  {
    id: "whey-protein",
    name: "Whey Protein Isolate",
    category: "Protéines",
    brand: "Olimp",
    goal: "Prise de Masse",
    price: 89,
    originalPrice: 99,
    image: "https://housenutrition.tn/storage/uploads/products/images/iso%20animal%201.webp-6912483f0dce5.webp",
    description:
      "Protéine de lactosérum pure de haute qualité pour la récupération musculaire et la croissance. Idéale après l'entraînement.",
    benefits: [
      "Récupération musculaire rapide",
      "25g de protéines par portion",
      "Faible en glucides et lipides",
      "Absorption rapide",
    ],
    flavor: "Chocolat, Vanille, Fraise",
    weight: "2.27 kg",
    inStock: true,
    stock: 15,
    badge: "best-seller",
  },
  {
    id: "creatine-monohydrate",
    name: "Créatine Monohydrate",
    category: "Créatine",
    brand: "Kevin Levrone",
    goal: "Performance",
    price: 55,
    image: "https://housenutrition.tn/storage/uploads/products/images/Creatine-200.webp-689b68479917d.webp-689c9a234eedb.webp",
    description:
      "Créatine monohydrate micronisée pour améliorer la force, la puissance et la performance athlétique.",
    benefits: [
      "Augmentation de la force",
      "Amélioration des performances",
      "Meilleure récupération",
      "Gain de masse musculaire",
    ],
    weight: "500 g",
    inStock: true,
    stock: 22,
    badge: "best-seller",
  },
  {
    id: "mass-gainer",
    name: "Complex Mass Pro",
    category: "Gainers",
    brand: "BioTechUSA",
    goal: "Prise de Masse",
    price: 75,
    image: "https://housenutrition.tn/storage/uploads/products/images/yava_complex_mass_pro_6kg_van.webp-688091ec20cab.webp",
    description:
      "Gainer haute calorie pour la prise de masse rapide. Riche en protéines, glucides complexes et calories.",
    benefits: [
      "Prise de masse rapide",
      "Haute teneur en calories",
      "Protéines de qualité",
      "Glucides complexes",
    ],
    flavor: "Chocolat, Vanille",
    weight: "3 kg",
    inStock: true,
    stock: 8,
    badge: "sale",
  },
  {
    id: "bcaa",
    name: "BCAA Xtend",
    category: "Acides Aminés",
    brand: "SFD",
    goal: "Récupération",
    price: 45,
    image: "https://housenutrition.tn/storage/uploads/products/images/1ee14e9d-12a9-4e53-acb8-8d1578458a70.png-69417a62e5247.png",
    description:
      "Acides aminés essentiels pour la récupération musculaire, la réduction de la fatigue et la préservation musculaire.",
    benefits: [
      "Réduction de la fatigue",
      "Récupération améliorée",
      "Préservation musculaire",
      "Hydratation optimale",
    ],
    flavor: "Fruits rouges, Citron",
    weight: "400 g",
    inStock: true,
    stock: 30,
  },
  {
    id: "pre-workout",
    name: "C4 Original",
    category: "Pré-Workout",
    brand: "MuscleTech",
    goal: "Performance",
    price: 65,
    image: "https://housenutrition.tn/storage/uploads/products/images/WhatsApp%20Image%202026-01-01%20at%2013.31.23%20(1)%20(1).webp-6958fa9967689.webp",
    description:
      "Pré-entraînement puissant pour un boost d'énergie, de concentration et de pompe musculaire.",
    benefits: [
      "Énergie explosive",
      "Concentration mentale",
      "Pompe musculaire",
      "Endurance accrue",
    ],
    flavor: "Fruits exotiques",
    weight: "300 g",
    inStock: true,
    stock: 12,
    badge: "new",
  },
  {
    id: "casein-protein",
    name: "Caséine Micellaire",
    category: "Protéines",
    brand: "Kevin Levrone",
    goal: "Récupération",
    price: 79,
    image: "https://housenutrition.tn/storage/uploads/products/images/71F7UeurBDL._AC_SX679_.webp-696fa0bf621bc.webp",
    description:
      "Protéine à libération lève, idéale pour la nuit ou les périodes de jeûne. Riche en calcium.",
    benefits: [
      "Libération lente (6-8h)",
      "Idéale avant le coucher",
      "Riche en calcium",
      "Anti-catabolique",
    ],
    flavor: "Chocolat, Vanille",
    weight: "2 kg",
    inStock: false,
    stock: 0,
  },
  {
    id: "collagen",
    name: "Collagène Hydrolysé",
    category: "Bien-être",
    brand: "WeightWorld",
    goal: "Bien-être",
    price: 49,
    image: "https://housenutrition.tn/storage/uploads/categories/images/collagen.webp-6937fb7b9e86e.webp",
    description:
      "Collagène hydrolysé pour la santé des articulations, de la peau et des os. Facile à digérer.",
    benefits: [
      "Santé des articulations",
      "Peau éclatante",
      "Os solides",
      "Récupération tendineuse",
    ],
    weight: "300 g",
    inStock: true,
    stock: 18,
  },
  {
    id: "omega-3",
    name: "Oméga-3 Triple Force",
    category: "Bien-être",
    brand: "WeightWorld",
    goal: "Bien-être",
    price: 35,
    image: "https://housenutrition.tn/storage/uploads/products/images/OMEGA.webp-694bdd3ea1b8c.webp",
    description:
      "Acides gras essentiels oméga-3 pour la santé cardiovasculaire, cognitive et articulaire.",
    benefits: [
      "Santé cardiaque",
      "Fonction cognitive",
      "Anti-inflammatoire",
      "Santé articulaire",
    ],
    weight: "120 capsules",
    inStock: true,
    stock: 25,
  },
  {
    id: "vitamin-d",
    name: "Vitamine D3 5000 UI",
    category: "Vitamines",
    brand: "ERIC FAVRE",
    goal: "Bien-être",
    price: 25,
    image: "https://housenutrition.tn/storage/uploads/products/images/Gemini_Generated_Image_3iyevu3iyevu3iye%20(1).webp-69fa2cd555810.webp",
    description:
      "Vitamine D3 haute dose pour le système immunitaire, l'absorption du calcium et la santé osseuse.",
    benefits: [
      "Immunité renforcée",
      "Absorption du calcium",
      "Santé osseuse",
      "Humeur améliorée",
    ],
    weight: "120 capsules",
    inStock: true,
    stock: 40,
  },
];

export const categories = [
  { id: "all", name: "Tous" },
  { id: "proteines", name: "Protéines" },
  { id: "creatine", name: "Créatine" },
  { id: "gainers", name: "Gainers" },
  { id: "acides-amines", name: "Acides Aminés" },
  { id: "pre-workout", name: "Pré-Workout" },
  { id: "bien-etre", name: "Bien-être" },
  { id: "vitamines", name: "Vitamines" },
];

export const brands = [
  { id: "all", name: "Toutes" },
  { id: "olimp", name: "Olimp" },
  { id: "biotech-usa", name: "BioTechUSA" },
  { id: "weight-world", name: "WeightWorld" },
  { id: "kevin-levrone", name: "Kevin Levrone" },
  { id: "sfd", name: "SFD" },
  { id: "muscle-tech", name: "MuscleTech" },
  { id: "eric-favre", name: "ERIC FAVRE" },
];

export const goals = [
  { id: "all", name: "Tous" },
  { id: "prise-de-masse", name: "Prise de Masse" },
  { id: "performance", name: "Performance" },
  { id: "recuperation", name: "Récupération" },
  { id: "bien-etre", name: "Bien-être" },
];
