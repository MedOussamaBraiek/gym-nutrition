"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Zap, Truck, Gift } from "lucide-react";

const heroBgImages = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=1920&h=1080&fit=crop",
];

const slides = [
  {
    title: "Atteins tes Objectifs",
    highlighted: "avec les Meilleurs Compléments",
    description:
      "Découvre notre sélection premium de créatine, protéines, et compléments fitness. 100% authentiques, livraison rapide partout en Tunisie.",
    cta: "Explorer la Boutique",
    ctaLink: "/products",
    secondary: "Nous Contacter",
    secondaryLink: "/contact",
    gradient: "from-slate-950/90 via-slate-900/80 to-red-950/90",
    bgIndex: 0,
    icon: "💪",
    tag: "Livraison dans toute la Tunisie",
    tagIcon: Zap,
  },
  {
    title: "Nouveautés Arrivage",
    highlighted: "Produits Exclusifs 2026",
    description:
      "Les dernières marques internationales débarquent en Tunisie. Premium quality, prix compétitifs, stock limité.",
    cta: "Voir les Nouveautés",
    ctaLink: "/products?filter=new",
    secondary: "Meilleures Ventes",
    secondaryLink: "/products?filter=best",
    gradient: "from-slate-950/90 via-red-950/80 to-slate-900/90",
    bgIndex: 1,
    icon: "🔥",
    tag: "Nouveaux produits chaque mois",
    tagIcon: Gift,
  },
  {
    title: "Livraison Offerte",
    highlighted: "dès 320 DT d'achat",
    description:
      "Profite de la livraison gratuite sur toutes tes commandes. Paiement à la livraison disponible dans toute la Tunisie.",
    cta: "Commander Maintenant",
    ctaLink: "/products",
    secondary: "En Savoir Plus",
    secondaryLink: "/contact",
    gradient: "from-red-950/90 via-slate-900/80 to-slate-950/90",
    bgIndex: 2,
    icon: "🚚",
    tag: "24-48h partout en Tunisie",
    tagIcon: Truck,
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={heroBgImages[slide.bgIndex]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-1/3 right-1/4 w-6 h-6 bg-primary/20 rounded-full animate-float-delayed" />
        <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-float" style={{ animationDuration: "8s" }} />
        <div className="absolute top-2/3 right-1/3 w-5 h-5 bg-primary/15 rounded-full animate-float-delayed" style={{ animationDuration: "7s" }} />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/30 rounded-full animate-float" style={{ animationDuration: "5s" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${current}`}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                key={`tag-${current}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm mb-6"
              >
                <slide.tagIcon className="w-4 h-4" />
                {slide.tag}
              </motion.span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                {slide.title}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white/90 to-white/50">
                  {slide.highlighted}
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-white/70 max-w-xl leading-relaxed">
                {slide.description}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href={slide.ctaLink}
                  className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/90 transition-all duration-200 hover:shadow-xl group"
                >
                  {slide.cta}
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href={slide.secondaryLink}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white/80 px-8 py-4 rounded-full text-lg font-semibold hover:border-white/50 hover:text-white transition-all duration-200"
                >
                  {slide.secondary}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`icon-${current}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 xl:w-96 xl:h-96 rounded-full bg-white/5 animate-pulse backdrop-blur-sm border border-white/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={[
                      "https://housenutrition.tn/storage/uploads/products/images/iso%20animal%201.webp-6912483f0dce5.webp",
                      "https://housenutrition.tn/storage/uploads/products/images/WhatsApp%20Image%202026-01-01%20at%2013.31.23%20(1)%20(1).webp-6958fa9967689.webp",
                      "https://housenutrition.tn/storage/uploads/products/images/1ee14e9d-12a9-4e53-acb8-8d1578458a70.png-69417a62e5247.png",
                    ][slide.bgIndex]}
                    alt=""
                    className="w-60 h-60 xl:w-72 xl:h-72 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center gap-4 mt-12 sm:mt-16">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === current
                    ? "w-8 h-2.5 bg-white"
                    : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
