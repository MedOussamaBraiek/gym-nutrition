export function getStockLabel(stock: number | undefined, inStock: boolean): string {
  if (stock === undefined) return inStock ? "En stock" : "Rupture de stock";
  if (stock === 0) return "Rupture de stock";
  if (stock <= 5) return "Stock faible";
  if (stock <= 20) return "En stock";
  return "Stock élevé";
}

export function getStockColor(stock: number | undefined, inStock: boolean): string {
  if (stock === undefined) return inStock ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-red-50 text-red-600 border-red-200";
  if (stock === 0) return "bg-red-50 text-red-600 border-red-200";
  if (stock <= 5) return "bg-amber-50 text-amber-600 border-amber-200";
  if (stock <= 20) return "bg-blue-50 text-blue-600 border-blue-200";
  return "bg-emerald-50 text-emerald-600 border-emerald-200";
}
