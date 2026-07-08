"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mohamed Ali",
    location: "Tunis",
    text: "Produits de qualité supérieure, livraison ultra rapide. Je recommande vivement Tunisia Nutrition pour tous vos compléments !",
    rating: 5,
  },
  {
    name: "Sarra Ben Ammar",
    location: "Sousse",
    text: "Commander chez Tunisia Nutrition c'est la garantie d'avoir des produits authentiques. Le service client est au top !",
    rating: 5,
  },
  {
    name: "Ahmed Karray",
    location: "Sfax",
    text: "Je prends ma créatine et ma whey chez eux depuis 6 mois. Résultats visibles, prix compétitifs. Merci l'équipe !",
    rating: 5,
  },
  {
    name: "Nour Bouzid",
    location: "Nabeul",
    text: "Enfin une boutique de confiance en Tunisie. Paiement à la livraison, produits originaux, que demander de plus ?",
    rating: 5,
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

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
            Témoignages
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ce que Nos Clients Disent
          </h2>
          <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto">
            Rejoins les 1000+ clients satisfaits à travers la Tunisie.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-dark-lighter rounded-3xl p-8 sm:p-12 border border-white/5 text-center"
            >
              <Quote className="w-10 h-10 text-primary/20 mx-auto mb-6" />
              <p className="text-lg sm:text-xl text-white/70 leading-relaxed italic">
                &ldquo;{testimonials[current].text}&rdquo;
              </p>
              <div className="flex justify-center gap-1 mt-6 mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <div className="font-semibold text-white">
                {testimonials[current].name}
              </div>
              <div className="text-sm text-white/40">
                {testimonials[current].location}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full bg-dark-lighter border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-white/50"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === current
                      ? "w-6 h-2 bg-primary"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full bg-dark-lighter border border-white/10 flex items-center justify-center hover:border-primary hover:text-primary transition-all text-white/50"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
