"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Menu, X, ShoppingBag, Dumbbell, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/products", label: "Produits" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  if (pathname.startsWith("/admin")) return null;

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-black/50 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Image
              src="/logo.png"
              alt="Tunisia Nutrition"
              width={1000}
              height={300}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <span className="text-xl font-bold tracking-tight">
              <span className="text-primary">Tunisia</span>{" "}
              <span className="text-white">Nutrition</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-white/60 hover:text-primary transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="/cart"
              className="relative p-2 text-white/60 hover:text-primary transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-all duration-200 hover:shadow-lg hover:shadow-primary/25"
            >
              <ShoppingBag className="w-4 h-4" />
              Boutique
            </Link>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/60 hover:text-primary transition-colors"
            aria-label="Menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-white/60 hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 text-base font-medium text-white/60 hover:text-primary transition-colors py-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Panier {itemCount > 0 && `(${itemCount})`}
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors mt-2"
              >
                <ShoppingBag className="w-4 h-4" />
                Boutique
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
