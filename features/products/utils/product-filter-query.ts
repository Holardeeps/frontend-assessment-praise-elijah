import type { ProductQueryState } from "@/types/filters";

import { buildProductsHref } from "./build-products-href";

export type ProductFilterPatch = Partial<Omit<ProductQueryState, "page">>;

const FILTER_QUERY_KEYS = [
  "search",
  "category",
  "minPrice",
  "maxPrice",
  "sort",
] as const;

// This keeps filter-driven URL updates distinct from pagination changes, so
// later controls can always reset back to page 1 without repeating the rule
// in every input handler.
export function applyProductFilterPatch(
  query: ProductQueryState,
  patch: ProductFilterPatch,
): ProductQueryState {
  const nextQuery: ProductQueryState = {
    ...query,
    ...patch,
  };

  // We only reset pagination when a real filter value changes. That lets the
  // dedicated pagination UI keep its own page transitions intact.
  const hasFilterChange = FILTER_QUERY_KEYS.some((key) => {
    const patchValue = patch[key];

    return patchValue !== undefined && patchValue !== query[key];
  });

  if (hasFilterChange) {
    nextQuery.page = 1;
  }

  return nextQuery;
}

// This produces a shareable /products URL for filter interactions while
// automatically preserving the “reset to page 1” behavior above.
export function buildProductsFilterHref(
  query: ProductQueryState,
  patch: ProductFilterPatch,
) {
  return buildProductsHref(applyProductFilterPatch(query, patch));
}
