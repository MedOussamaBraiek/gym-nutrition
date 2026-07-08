"use client";

import { motion } from "framer-motion";
import { Send, Mail, Bell } from "lucide-react";

export default function Newsletter() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')] bg-cover bg-center opacity-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Bell className="w-10 h-10 text-red-200 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Ne Rate Rien
            </h2>
            <p className="mt-3 text-lg text-red-100/80 max-w-md">
              Sois le premier informé des nouveaux arrivages, offres exclusives et
              conseils fitness. Promos spéciales abonnés chaque mois.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              {["Offres exclusives abonnés", "Nouveaux produits en avant-première", "Conseils et programmes fitness"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 text-sm text-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-200 shrink-0" />
                    {item}
                  </div>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <form
              onSubmit={(e) => e.preventDefault()}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5 text-red-200" />
                <span className="text-white font-medium">Inscription Newsletter</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Ton adresse email"
                  className="flex-1 px-5 py-3.5 rounded-xl text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition-all text-sm"
                  required
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3.5 rounded-xl font-semibold hover:bg-red-50 transition-all duration-200 shadow-lg shadow-black/20"
                >
                  <Send className="w-4 h-4" />
                  S&apos;inscrire
                </button>
              </div>
              <p className="mt-3 text-xs text-red-200/60">
                Pas de spam. Désinscription à tout moment.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
