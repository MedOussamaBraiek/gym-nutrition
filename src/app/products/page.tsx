"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import { categories, brands as staticBrands, goals } from "@/lib/products";
import { useProducts } from "@/lib/use-products";
import ProductCard from "@/components/ui/ProductCard";

interface FilterGroupProps {
  title: string;
  items: { id: string; name: string }[];
  selected: string[];
  onChange: (id: string) => void;
}

function FilterGroup({ title, items, selected, onChange }: FilterGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-white/5 pb-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-2 text-sm font-semibold text-white/80 uppercase tracking-wider"
      >
        {title}
        <ChevronDown
          className={`w-4 h-4 text-white/30 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {items.slice(1).map((item) => (
            <label
              key={item.id}
              onClick={() => onChange(item.id)}
              className="flex items-center gap-3 py-1.5 cursor-pointer group"
            >
              <span
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150 ${
                  selected.includes(item.id)
                    ? "bg-primary border-primary"
                    : "border-white/20 group-hover:border-primary"
                }`}
              >
                {selected.includes(item.id) && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-white/50 group-hover:text-white transition-colors">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductsPageContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const cat = searchParams?.get("category");
    if (cat) {
      setSelectedCategories([normalizeFilter(cat)]);
    }
  }, [searchParams]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [settingsBrands, setSettingsBrands] = useState<{ name: string }[]>(staticBrands.slice(1).map((b) => ({ name: b.name })));

  useEffect(() => {
    fetch("/api/site-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.brands && data.brands.length > 0) setSettingsBrands(data.brands);
      })
      .catch(() => {});
  }, []);

  const normalizeFilter = (value: string) =>
    value
      .toLowerCase()
      .replace(/é|è|ê/g, "e")
      .replace(/à|â/g, "a")
      .replace(/ù|û/g, "u")
      .replace(/î/g, "i")
      .replace(/ô/g, "o")
      .replace(/ç/g, "c")
      .replace(/\s+/g, "-");

  const toggleFilter = (
    list: string[],
    setter: (v: string[]) => void,
    id: string
  ) => {
    setter(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(normalizeFilter(product.category));
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.includes(normalizeFilter(product.brand));
      const matchesGoal =
        selectedGoals.length === 0 ||
        selectedGoals.includes(normalizeFilter(product.goal));
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesBrand && matchesGoal && matchesPrice;
    });
  }, [selectedCategories, selectedBrands, selectedGoals, priceRange, searchQuery]);

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    selectedGoals.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500;

  const dynamicBrands = useMemo(() => {
    return [{ id: "all", name: "Toutes" }, ...settingsBrands.map((b) => ({ id: normalizeFilter(b.name), name: b.name }))];
  }, [settingsBrands]);

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setSelectedGoals([]);
    setPriceRange([0, 500]);
    setSearchQuery("");
  };

  const totalFilters =
    selectedCategories.length + selectedBrands.length + selectedGoals.length;

  return (
    <div className="pt-24 pb-16 sm:pt-28 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Nos Produits
          </h1>
          <p className="mt-3 text-lg text-white/50">
            Découvre notre gamme complète de compléments nutritionnels.
          </p>
        </motion.div>

        <div className="relative w-full max-w-md mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-dark-lighter border border-white/10 text-white placeholder-white/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
          />
        </div>

        <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium text-white bg-dark-lighter border border-white/10 rounded-xl px-4 py-2.5 mb-4 w-full"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm4 6a1 1 0 011-1h8a1 1 0 010 2H8a1 1 0 01-1-1zm2 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z" /></svg>
            {showFilters ? "Masquer les filtres" : "Filtres"}{totalFilters > 0 && ` (${totalFilters})`}
          </button>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className={`lg:w-56 shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  Filtres
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-primary hover:text-primary-light transition-colors font-medium"
                  >
                    Tout effacer
                  </button>
                )}
              </div>

              <div className="bg-dark-lighter rounded-xl border border-white/5 p-4 space-y-1">
                <FilterGroup
                  title="Catégories"
                  items={categories}
                  selected={selectedCategories}
                  onChange={(id) =>
                    toggleFilter(selectedCategories, setSelectedCategories, id)
                  }
                />

                <FilterGroup
                  title="Marques"
                  items={dynamicBrands}
                  selected={selectedBrands}
                  onChange={(id) =>
                    toggleFilter(selectedBrands, setSelectedBrands, id)
                  }
                />

                <FilterGroup
                  title="Objectifs"
                  items={goals}
                  selected={selectedGoals}
                  onChange={(id) =>
                    toggleFilter(selectedGoals, setSelectedGoals, id)
                  }
                />

                <div className="pt-4">
                  <span className="text-sm font-semibold text-white/80 uppercase tracking-wider block mb-3">
                    Prix
                  </span>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white/50">{priceRange[0]} TND</span>
                    <span className="text-white/20">—</span>
                    <span className="text-white/50">{priceRange[1]} TND</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full accent-primary mt-2"
                  />
                </div>
              </div>
            </div>
          </motion.aside>

          <div className="flex-1 min-w-0">
            {hasActiveFilters && (
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-sm text-white/50">
                  {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
                </span>
                {totalFilters > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    {totalFilters} filtre{totalFilters > 1 ? "s" : ""}
                  </button>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-dark-lighter rounded-2xl border border-white/5">
                <p className="text-white/50 text-lg">Aucun produit trouvé.</p>
                <p className="text-white/30 text-sm mt-2">
                  Essaie de modifier tes filtres.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-primary font-medium text-sm hover:text-primary-light transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03, duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse text-white/30 text-lg">Chargement...</div>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
