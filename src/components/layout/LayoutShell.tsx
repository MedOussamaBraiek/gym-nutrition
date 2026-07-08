"use client";

import Header from "./Header";
import Footer from "./Footer";
import FloatingBar from "./FloatingBar";
import { CartProvider } from "@/lib/cart-store";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <FloatingBar />
    </CartProvider>
  );
}
