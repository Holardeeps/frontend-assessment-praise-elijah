import { PRODUCT_SORT_OPTIONS } from "@/features/products/constants";
import { formatCurrency } from "@/lib/utils/format-number";
import type { ProductFilterControlKey, ProductQueryState } from "@/types/filters";

import { formatCategoryLabel } from "./format-category-label";

function getSortLabel(sort: ProductQueryState["sort"]) {
  return PRODUCT_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? null;
}

function getPriceRangePreview(query: ProductQueryState) {
  if (query.minPrice !== null && query.maxPrice !== null) {
    return `${formatCurrency(query.minPrice)} to ${formatCurrency(query.maxPrice)}`;
  }

  if (query.minPrice !== null) {
    return `From ${formatCurrency(query.minPrice)}`;
  }

  if (query.maxPrice !== null) {
    return `Up to ${formatCurrency(query.maxPrice)}`;
  }

  return "Any price";
}

// This helper turns the current URL-driven query state into concise values for
// the filter shell, so the upcoming interactive controls can inherit the same
// product-facing labels without re-implementing the display logic.
export function getProductFilterPreviews(query: ProductQueryState) {
  return {
    search: query.search || "All products",
    category: query.category ? formatCategoryLabel(query.category) : "All categories",
    priceRange: getPriceRangePreview(query),
    sort: getSortLabel(query.sort) ?? "Default order",
  } satisfies Record<ProductFilterControlKey, string>;
}
