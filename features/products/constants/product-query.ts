import type { ProductQueryState, ProductSearchParamKey, SortOption } from "@/types/filters";

// These values establish the listing route contract up front so pagination and
// query parsing do not duplicate magic numbers or fallback rules later on.
export const PRODUCTS_PER_PAGE = 24;
export const DEFAULT_PRODUCT_PAGE = 1;
export const MIN_PRODUCT_PAGE = 1;

// This ordered key list gives the parser phase one canonical source for the
// search params we support on /products, which keeps URL handling consistent.
export const PRODUCT_SEARCH_PARAM_KEYS: readonly ProductSearchParamKey[] = [
  "search",
  "category",
  "minPrice",
  "maxPrice",
  "sort",
  "page",
];

type ProductSortDefinition = {
  value: SortOption;
  label: string;
  sortBy: "title" | "price" | "rating";
  order: "asc" | "desc";
};

// These are the only sort modes the listing route will accept, and the extra
// metadata makes them useful for both UI labels and DummyJSON query building.
export const PRODUCT_SORT_OPTIONS: readonly ProductSortDefinition[] = [
  {
    value: "title-asc",
    label: "Title: A to Z",
    sortBy: "title",
    order: "asc",
  },
  {
    value: "title-desc",
    label: "Title: Z to A",
    sortBy: "title",
    order: "desc",
  },
  {
    value: "price-asc",
    label: "Price: Low to high",
    sortBy: "price",
    order: "asc",
  },
  {
    value: "price-desc",
    label: "Price: High to low",
    sortBy: "price",
    order: "desc",
  },
  {
    value: "rating-asc",
    label: "Rating: Low to high",
    sortBy: "rating",
    order: "asc",
  },
  {
    value: "rating-desc",
    label: "Rating: High to low",
    sortBy: "rating",
    order: "desc",
  },
];

// This compact lookup list makes it easy for the parser to validate whether a
// raw sort query string is one of the supported URL values above.
export const PRODUCT_SORT_VALUES = PRODUCT_SORT_OPTIONS.map((option) => option.value);

// This default query object gives the server page and parser one shared "empty
// state" for the listing route, which helps reset behavior stay predictable.
export const DEFAULT_PRODUCT_QUERY_STATE: ProductQueryState = {
  search: "",
  category: null,
  minPrice: null,
  maxPrice: null,
  sort: null,
  page: DEFAULT_PRODUCT_PAGE,
};
