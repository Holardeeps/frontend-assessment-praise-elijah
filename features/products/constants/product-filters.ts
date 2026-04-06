import type { ProductFilterDefinition } from "@/types/filters";

// This ID gives the listing page one stable anchor for the upcoming filter
// bar, so navigation and pagination can target the same section consistently.
export const PRODUCT_FILTER_SECTION_ID = "filters";

// The debounce timing is defined here early so the future search input and
// its tests share one contract instead of duplicating the delay value.
export const PRODUCT_FILTER_DEBOUNCE_MS = 400;

// These definitions let the filter UI and future tests share one ordered list
// of filter groups and product-facing copy for the listing experience.
export const PRODUCT_FILTER_DEFINITIONS: readonly ProductFilterDefinition[] = [
  {
    key: "search",
    label: "Search products",
    description: "Find products by title or keyword.",
    kind: "search",
  },
  {
    key: "category",
    label: "Category",
    description: "Jump straight into a specific product group.",
    kind: "select",
  },
  {
    key: "priceRange",
    label: "Price range",
    description: "Narrow the catalog to a budget window.",
    kind: "price-range",
  },
  {
    key: "sort",
    label: "Sort order",
    description: "Change how matching products are arranged.",
    kind: "sort",
  },
] as const;
