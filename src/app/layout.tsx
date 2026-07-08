import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tunisia Nutrition - Compléments Alimentaires & Fitness",
  description:
    "Votre boutique de confiance en Tunisie pour la créatine, les protéines, et les compléments sportifs. Livraison rapide dans toute la Tunisie.",
  keywords: ["nutrition", "créatine", "protéine", "fitness", "Tunisie", "compléments sportifs"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-black text-white font-sans">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
