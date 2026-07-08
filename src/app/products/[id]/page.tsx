import { connectDB } from "@/lib/mongodb";
import { ProductModel } from "@/lib/models/product";
import ProductDetailClient from "./ProductDetailClient";
import type { Product } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const product = await ProductModel.findById(id).lean();
    if (!product) return { title: "Produit non trouvé - Tunisia Nutrition" };
    return {
      title: `${product.name} - Tunisia Nutrition`,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: `${product.name} - Tunisia Nutrition`,
        description: product.description?.slice(0, 160),
        type: "website",
        images: product.image ? [{ url: product.image, width: 800, height: 800 }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${product.name} - Tunisia Nutrition`,
        description: product.description?.slice(0, 160),
        images: product.image ? [product.image] : [],
      },
    };
  } catch {
    return { title: "Tunisia Nutrition" };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let product: Product | null = null;
  try {
    await connectDB();
    const doc = await ProductModel.findById(id).lean();
    if (doc) {
      const serialized = JSON.parse(JSON.stringify(doc));
      product = { ...serialized, id: serialized._id };
    }
  } catch {
    // fallback — client will try to find from full list
  }

  return <ProductDetailClient initialProduct={product} />;
}
