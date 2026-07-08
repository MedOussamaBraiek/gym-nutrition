"use client";

import { useState, useEffect } from "react";
import type { Product } from "./products";

let cache: Product[] | null = null;
let promise: Promise<Product[]> | null = null;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(cache || []);
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) {
      setProducts(cache);
      setLoading(false);
      return;
    }
    if (!promise) {
      promise = fetch("/api/products")
        .then((res) => res.json())
        .then((data: (Product & { _id: string })[]) =>
          data.map((p) => ({ ...p, id: p._id || p.id }))
        );
      promise.then((mapped) => {
        cache = mapped;
        setProducts(mapped);
        setLoading(false);
      });
    } else {
      promise.then((mapped) => {
        setProducts(mapped);
        setLoading(false);
      });
    }
  }, []);

  return { products, loading };
}
