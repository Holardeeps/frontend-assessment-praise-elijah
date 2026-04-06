import { toProductSearchParams } from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

// These shared query keys keep TanStack Query cache entries stable across the
// app so future client-side enhancements can reuse one naming scheme.
export const productQueryKeys = {
  all: ["products"] as const,
  listing: (query: ProductQueryState) =>
    [...productQueryKeys.all, "listing", toProductSearchParams(query)] as const,
  relatedProducts: (productId: number, limit: number) =>
    [...productQueryKeys.all, "related", productId, limit] as const,
};
