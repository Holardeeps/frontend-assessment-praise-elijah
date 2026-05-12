import type { Product } from "@/types/product";

export function getAverageRating(products: Product[]): string {
  if (products.length === 0) {
    return "0.0";
  }

  const total = products.reduce((sum, product) => sum + product.rating, 0);

  return (total / products.length).toFixed(1);
}
