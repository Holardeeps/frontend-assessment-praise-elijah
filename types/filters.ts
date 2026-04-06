// These sort options match the query values we plan to support in the URL,
// which keeps parsing and link generation aligned with one shared contract.
export type SortOption =
  | "title-asc"
  | "title-desc"
  | "price-asc"
  | "price-desc"
  | "rating-asc"
  | "rating-desc";

// These control keys represent the logical filter groups we will render in
// the UI, which is slightly different from the raw URL params because price
// uses two params but appears as one combined control.
export type ProductFilterControlKey =
  | "search"
  | "category"
  | "priceRange"
  | "sort";

export type ProductFilterControlKind =
  | "search"
  | "select"
  | "price-range"
  | "sort";

export type ProductFilterDefinition = {
  key: ProductFilterControlKey;
  label: string;
  description: string;
  kind: ProductFilterControlKind;
};

// This shape gives us one reusable way to talk about the optional price
// bounds that will later power both filter parsing and UI form fields.
export type PriceRange = {
  minPrice: number | null;
  maxPrice: number | null;
};

// This is the typed version of the /products URL contract, so the rest of the
// app can work with normalized values instead of raw search param strings.
export type ProductQueryState = PriceRange & {
  search: string;
  category: string | null;
  sort: SortOption | null;
  page: number;
};

// These keys are the exact search params we expect on the listing route,
// which will make the parser phase easier to keep exhaustive and type-safe.
export type ProductSearchParamKey =
  | "search"
  | "category"
  | "minPrice"
  | "maxPrice"
  | "sort"
  | "page";

export type ProductSearchParams = Partial<Record<ProductSearchParamKey, string>>;
