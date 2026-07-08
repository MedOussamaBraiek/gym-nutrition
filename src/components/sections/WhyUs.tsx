"use client";

import { motion } from "framer-motion";
import { Shield, Truck, BadgeCheck, HeadphonesIcon, CreditCard, Package } from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    title: "100% Authentique",
    description: "Tous nos produits sont originaux et importés directement des meilleures marques.",
  },
  {
    icon: Truck,
    title: "Livraison Rapide",
    description: "Expédition sous 24h et livraison en 24-48h partout en Tunisie.",
  },
  {
    icon: Shield,
    title: "Qualité Garantie",
    description: "Nous sélectionnons rigoureusement chaque produit pour garantir une qualité optimale.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support Client",
    description: "Notre équipe est disponible pour répondre à toutes tes questions.",
  },
  {
    icon: CreditCard,
    title: "Paiement Sécurisé",
    description: "Paiement à la livraison ou par carte bancaire en toute sécurité.",
  },
  {
    icon: Package,
    title: "Emballage Soigné",
    description: "Chaque commande est emballée avec soin pour garantir sa fraîcheur.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyUs() {
  return (
    <section className="py-20 sm:py-28 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Pourquoi Nous ?
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Pourquoi Nous Choisir ?
          </h2>
          <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto">
            On ne fait pas que vendre des compléments, on construit une communauté fitness
            de confiance en Tunisie.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reasons.map((reason) => (
            <motion.div
              key={reason.title}
              variants={itemVariants}
              className="group bg-dark-lighter rounded-2xl p-6 sm:p-8 border border-white/5 hover:border-primary/20 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.1)]"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <reason.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-white/50 leading-relaxed">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
