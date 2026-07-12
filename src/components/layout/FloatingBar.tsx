"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, MessageCircle } from "lucide-react";

export default function FloatingBar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <a
        href="https://wa.me/21627804998"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-pulse-glow"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>

      <AnimatePresence>
        {showScroll && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 w-10 h-10 rounded-full bg-dark-lighter border border-white/10 text-white/60 flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
