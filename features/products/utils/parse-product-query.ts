import {
  DEFAULT_PRODUCT_QUERY_STATE,
  DEFAULT_PRODUCT_PAGE,
  MIN_PRODUCT_PAGE,
  PRODUCT_SEARCH_PARAM_KEYS,
  PRODUCT_SORT_VALUES,
} from "@/features/products/constants";
import { normalizePriceRange } from "@/features/products/utils/normalize-price-range";
import type {
  ProductQueryState,
  ProductSearchParamKey,
  ProductSearchParams,
  SortOption,
} from "@/types/filters";

type SearchParamValue = string | string[] | undefined;

export type ProductRouteSearchParams = Record<string, SearchParamValue>;
export type ProductRouteSearchParamsInput =
  | ProductRouteSearchParams
  | Promise<ProductRouteSearchParams>;

// Next's current App Router docs show page-level searchParams arriving as a
// Promise of string | string[] | undefined values, so this parser accepts that
// shape directly and normalizes it into our typed listing query contract.
export async function parseProductQuery(
  searchParamsInput: ProductRouteSearchParamsInput,
): Promise<ProductQueryState> {
  const searchParams = await searchParamsInput;
  const knownParams = pickKnownProductSearchParams(searchParams);

  const search = parseSearchText(knownParams.search);
  const category = parseCategory(knownParams.category);
  const sort = parseSort(knownParams.sort);
  const page = parsePage(knownParams.page);

  // Price bounds are normalized together so we can gracefully recover from
  // user input like minPrice=500&maxPrice=100 without dropping the filter.
  const { minPrice, maxPrice } = normalizePriceRange(
    parseNonNegativeNumber(knownParams.minPrice),
    parseNonNegativeNumber(knownParams.maxPrice),
  );

  return {
    search,
    category,
    minPrice,
    maxPrice,
    sort,
    page,
  };
}

// This helper narrows the raw route object down to the exact keys our listing
// route supports, which keeps the parser intentionally blind to unrelated params.
function pickKnownProductSearchParams(
  searchParams: ProductRouteSearchParams,
): Partial<Record<ProductSearchParamKey, SearchParamValue>> {
  const knownParams: Partial<Record<ProductSearchParamKey, SearchParamValue>> = {};

  for (const key of PRODUCT_SEARCH_PARAM_KEYS) {
    knownParams[key] = searchParams[key];
  }

  return knownParams;
}

// Repeated query params can arrive as arrays, so we consistently pick the first
// meaningful value and trim it before any field-specific parsing happens.
function getSingleSearchParamValue(value: SearchParamValue): string | undefined {
  if (Array.isArray(value)) {
    const firstNonEmptyValue = value.find((entry) => entry.trim().length > 0);
    return normalizeText(firstNonEmptyValue ?? value[0]);
  }

  return normalizeText(value);
}

function normalizeText(value: string | undefined): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const normalizedValue = value.replace(/\s+/g, " ").trim();

  return normalizedValue.length > 0 ? normalizedValue : undefined;
}

function parseSearchText(value: SearchParamValue) {
  const searchText = getSingleSearchParamValue(value);

  return searchText
    ? searchText.toLowerCase()
    : DEFAULT_PRODUCT_QUERY_STATE.search;
}

function parseCategory(value: SearchParamValue) {
  const category = getSingleSearchParamValue(value);

  return category ? category.toLowerCase() : DEFAULT_PRODUCT_QUERY_STATE.category;
}

function parseSort(value: SearchParamValue): SortOption | null {
  const sort = getSingleSearchParamValue(value);

  return sort && PRODUCT_SORT_VALUES.includes(sort as SortOption)
    ? (sort as SortOption)
    : DEFAULT_PRODUCT_QUERY_STATE.sort;
}

function parsePage(value: SearchParamValue): number {
  const page = getSingleSearchParamValue(value);

  if (!page) {
    return DEFAULT_PRODUCT_PAGE;
  }

  const parsedPage = Number(page);

  if (!Number.isInteger(parsedPage)) {
    return DEFAULT_PRODUCT_PAGE;
  }

  return Math.max(MIN_PRODUCT_PAGE, parsedPage);
}

function parseNonNegativeNumber(value: SearchParamValue): number | null {
  const normalizedValue = getSingleSearchParamValue(value);

  if (!normalizedValue) {
    return null;
  }

  const parsedNumber = Number(normalizedValue);

  if (!Number.isFinite(parsedNumber) || parsedNumber < 0) {
    return null;
  }

  return parsedNumber;
}

// This serializer will let later phases preserve and rebuild listing URLs from
// typed query state without scattering param formatting across components.
export function toProductSearchParams(query: ProductQueryState): ProductSearchParams {
  return {
    ...(query.search ? { search: query.search } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.minPrice !== null ? { minPrice: String(query.minPrice) } : {}),
    ...(query.maxPrice !== null ? { maxPrice: String(query.maxPrice) } : {}),
    ...(query.sort ? { sort: query.sort } : {}),
    ...(query.page !== DEFAULT_PRODUCT_PAGE ? { page: String(query.page) } : {}),
  };
}
