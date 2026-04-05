import {
  DEFAULT_PRODUCT_PAGE,
  MIN_PRODUCT_PAGE,
  PRODUCTS_PER_PAGE,
} from "@/features/products/constants";

type PaginationMetaInput = {
  currentPage: number;
  totalItems: number;
  perPage?: number;
};

export type PaginationMeta = {
  currentPage: number;
  totalItems: number;
  perPage: number;
  totalPages: number;
  offset: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

// This keeps the page size safe even if a later caller accidentally passes an
// invalid value, which makes the pagination helpers more resilient to reuse.
function normalizePerPage(perPage?: number) {
  if (!perPage || !Number.isFinite(perPage) || perPage < 1) {
    return PRODUCTS_PER_PAGE;
  }

  return Math.floor(perPage);
}

// This centralizes the "skip" math needed by paginated API requests so we do
// not repeat offset calculations in route files or the API layer later on.
export function getPaginationOffset(currentPage: number, perPage = PRODUCTS_PER_PAGE) {
  const normalizedPerPage = normalizePerPage(perPage);
  const safePage = Math.max(MIN_PRODUCT_PAGE, Math.floor(currentPage));

  return (safePage - 1) * normalizedPerPage;
}

// This gives the app one consistent rule for how many pages exist. Empty
// result sets deliberately return 0 so the UI can render a true empty state.
export function getTotalPages(totalItems: number, perPage = PRODUCTS_PER_PAGE) {
  const normalizedPerPage = normalizePerPage(perPage);
  const safeTotalItems = Math.max(0, Math.floor(totalItems));

  if (safeTotalItems === 0) {
    return 0;
  }

  return Math.ceil(safeTotalItems / normalizedPerPage);
}

// This clamps a requested page into the valid range for the current result
// set, which is useful when filters shrink the dataset after someone is on a
// later page like page 5 or page 6.
export function clampPageToTotal(currentPage: number, totalPages: number) {
  const safePage = Number.isFinite(currentPage)
    ? Math.max(MIN_PRODUCT_PAGE, Math.floor(currentPage))
    : DEFAULT_PRODUCT_PAGE;

  if (totalPages <= 0) {
    return DEFAULT_PRODUCT_PAGE;
  }

  return Math.min(safePage, totalPages);
}

// This bundles the page math the listing route will need after data fetching:
// a clamped current page, total pages, offset, and previous/next booleans.
export function buildPaginationMeta({
  currentPage,
  totalItems,
  perPage = PRODUCTS_PER_PAGE,
}: PaginationMetaInput): PaginationMeta {
  const normalizedPerPage = normalizePerPage(perPage);
  const totalPages = getTotalPages(totalItems, normalizedPerPage);
  const normalizedCurrentPage = clampPageToTotal(currentPage, totalPages);

  return {
    currentPage: normalizedCurrentPage,
    totalItems: Math.max(0, Math.floor(totalItems)),
    perPage: normalizedPerPage,
    totalPages,
    offset: getPaginationOffset(normalizedCurrentPage, normalizedPerPage),
    hasNextPage: totalPages > 0 && normalizedCurrentPage < totalPages,
    hasPreviousPage: normalizedCurrentPage > MIN_PRODUCT_PAGE && totalPages > 0,
  };
}
