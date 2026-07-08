"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import type { Product } from "@/lib/products";

interface AdminStore {
  products: Product[];
  addProduct: (p: Omit<Product, "_id">) => Promise<void>;
  updateProduct: (id: string, p: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
  loading: boolean;
  error: string | null;
  totalProducts: number;
  totalStock: number;
  totalValue: number;
}

const AdminContext = createContext<AdminStore | null>(null);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(
        data.map((p: Product & { _id: string }) => ({
          ...p,
          id: p._id || p.id,
        }))
      );
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!loading && products.length === 0 && error) {
      fetch("/api/seed", { method: "POST" }).then(() => fetchProducts()).catch(() => {});
    }
  }, [loading, products.length, error, fetchProducts]);

  const addProduct = useCallback(async (p: Product) => {
    const { id, ...rest } = p;
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rest),
    });
    if (!res.ok) throw new Error("Failed to add product");
    await fetchProducts();
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update product");
    await fetchProducts();
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string) => {
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete product");
    await fetchProducts();
  }, [fetchProducts]);

  const getProduct = useCallback(
    (id: string) => products.find((p: Product & { _id?: string }) => (p._id || p.id) === id),
    [products]
  );

  const totalProducts = products.length;
  const totalStock = products.filter((p) => p.inStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  return (
    <AdminContext.Provider
      value={{ products, addProduct, updateProduct, deleteProduct, getProduct, loading, error, totalProducts, totalStock, totalValue }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
