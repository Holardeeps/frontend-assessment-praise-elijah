import { PRODUCT_FILTER_DEFINITIONS } from "@/features/products/constants";
import type { ProductFilterControlKey, ProductQueryState } from "@/types/filters";

import { getProductFilterPreviews } from "./product-filter-preview";

export type ActiveProductFilter = {
  key: ProductFilterControlKey;
  label: string;
  value: string;
};

function getFilterLabel(key: ProductFilterControlKey) {
  return PRODUCT_FILTER_DEFINITIONS.find((filter) => filter.key === key)?.label ?? key;
}

// This helper turns the current server-normalized query into the subset of
// filters that are actually active, which keeps the summary UI aligned with
// the same source of truth as the results and pagination.
export function getActiveProductFilters(
  query: ProductQueryState,
): ActiveProductFilter[] {
  const previews = getProductFilterPreviews(query);
  const activeKeys: ProductFilterControlKey[] = [];

  if (query.search) {
    activeKeys.push("search");
  }

  if (query.category) {
    activeKeys.push("category");
  }

  if (query.minPrice !== null || query.maxPrice !== null) {
    activeKeys.push("priceRange");
  }

  if (query.sort) {
    activeKeys.push("sort");
  }

  return activeKeys.map((key) => ({
    key,
    label: getFilterLabel(key),
    value: previews[key],
  }));
}
