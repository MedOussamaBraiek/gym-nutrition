"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { useProducts } from "@/lib/use-products";
import { useSettings } from "@/lib/use-settings";
import ProductCard from "@/components/ui/ProductCard";

export default function FeaturedProducts() {
  const { products } = useProducts();
  const { settings } = useSettings();
  const featuredIds = settings.featuredProductIds || [];
  const featured = featuredIds.length > 0
    ? products.filter((p) => featuredIds.includes(p.id)).slice(0, 4)
    : products.slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Meilleures Ventes
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            {settings.featured.title}
          </h2>
          <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto">
            {settings.featured.subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-light transition-colors group text-lg"
          >
            Voir Tous les Produits
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
