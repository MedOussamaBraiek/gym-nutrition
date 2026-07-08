"use client";

import { useState, useEffect } from "react";
import type { Product } from "./products";

let cache: Product[] | null = null;
let promise: Promise<Product[]> | null = null;
let cachedError: string | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(cachedError);

  useEffect(() => {
    if (cache) {
      setProducts(cache);
      setLoading(false);
      return;
    }
    if (cachedError) {
      setError(cachedError);
      setLoading(false);
      return;
    }
    if (!promise) {
      promise = fetch("/api/products").then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erreur de chargement");
        }
        return res.json();
      }).then((data: (Product & { _id: string })[]) =>
        data.map((p) => ({ ...p, id: p._id || p.id }))
      ).catch((err) => {
        cachedError = err.message;
        throw err;
      });
    }
    promise.then((mapped) => {
      cache = mapped;
      setProducts(mapped);
      setLoading(false);
    }).catch((err) => {
      setError(err.message);
      setLoading(false);
    });
  }, []);

  return { products, loading, error };
}
