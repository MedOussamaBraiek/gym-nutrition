"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BrandItem {
  name: string;
  origin: string;
  logo: string;
}

const brandList: BrandItem[] = [
  {
    name: "Olimp",
    origin: "Pologne",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/scitec.png-6863bc2e0bd79.png",
  },
  {
    name: "BioTechUSA",
    origin: "USA",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/BIOTECHUSA_1.png-69ca8c49d4735.png",
  },
  {
    name: "WeightWorld",
    origin: "UK",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/universal.webp-663f3d4a2cf02.webp",
  },
  {
    name: "Kevin Levrone",
    origin: "USA",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/logo__3_-removebg-preview.webp-677e895448c8a.webp",
  },
  {
    name: "SFD",
    origin: "France",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/animal.webp-663f40d543c36.webp-691ee74b7d208.webp",
  },
  {
    name: "MuscleTech",
    origin: "USA",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/logo.png-68c683a976c4e.png",
  },
  {
    name: "ERIC FAVRE",
    origin: "France",
    logo: "https://housenutrition.tn/storage/uploads/brands/images/image-Photoroom%20(12).png-6921b5ba0a0da.png",
  },
];

export default function Brands() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">
            Marques Officielles
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Les Meilleures Marques Internationales
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Produits 100% authentiques, importés directement des fabricants
          </p>
        </motion.div>
      </div>

      <div className="relative">
        <div className="flex gap-24 animate-marquee w-max items-center">
          {[...brandList, ...brandList].map((brand, i) => (
            <div key={i} className="flex flex-col items-center gap-4 shrink-0">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={240}
                height={90}
                className="object-contain h-34 w-auto"
              />
              <span className="text-slate-400 text-sm font-medium whitespace-nowrap">
                {brand.name} — {brand.origin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
