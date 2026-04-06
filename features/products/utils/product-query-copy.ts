import { PRODUCT_SORT_OPTIONS } from "@/features/products/constants";
import type { ProductQueryState } from "@/types/filters";
import { formatCategoryLabel } from "./format-category-label";

function getSortLabel(sort: ProductQueryState["sort"]) {
  return PRODUCT_SORT_OPTIONS.find((option) => option.value === sort)?.label ?? null;
}

// This turns the raw URL-driven query state into plain language so the current
// view is understandable to someone browsing the product, not just the code.
export function getProductQuerySummary(query: ProductQueryState) {
  const summaryParts: string[] = [];

  if (query.search) {
    summaryParts.push(`Results for "${query.search}"`);
  } else {
    summaryParts.push("Showing the full catalog");
  }

  if (query.category) {
    summaryParts.push(`in ${formatCategoryLabel(query.category)}`);
  }

  if (query.minPrice !== null && query.maxPrice !== null) {
    summaryParts.push(`with prices between $${query.minPrice} and $${query.maxPrice}`);
  } else if (query.minPrice !== null) {
    summaryParts.push(`priced from $${query.minPrice}`);
  } else if (query.maxPrice !== null) {
    summaryParts.push(`priced up to $${query.maxPrice}`);
  }

  const sortLabel = getSortLabel(query.sort);

  if (sortLabel) {
    summaryParts.push(`sorted by ${sortLabel}`);
  }

  if (query.page > 1) {
    summaryParts.push(`on page ${query.page}`);
  }

  return `${summaryParts.join(" ")}.`;
}
