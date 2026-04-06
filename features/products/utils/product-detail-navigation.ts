import type { ProductQueryState } from "@/types/filters";

import { buildProductsHref } from "./build-products-href";

const DEFAULT_PRODUCTS_RETURN_HREF = "/products#results";

// This builds detail-page links from the current catalog state so the detail
// route can later send people back to the same filtered result set they came from.
export function buildProductDetailHref(
  productId: number,
  query: ProductQueryState,
) {
  return buildProductDetailHrefFromReturnHref(
    productId,
    `${buildProductsHref(query)}#results`,
  );
}

// This keeps detail links reusable outside the listing page, such as related
// items on the detail route that should preserve the same return target.
export function buildProductDetailHrefFromReturnHref(
  productId: number,
  returnHref: string,
) {
  const searchParams = new URLSearchParams({
    from: returnHref,
  });

  return `/products/${productId}?${searchParams.toString()}`;
}

// This keeps the return link on the detail route safe and predictable by only
// accepting in-app catalog paths and falling back when the query is missing.
export function resolveProductReturnHref(from: string | string[] | undefined) {
  const rawFrom = Array.isArray(from) ? from[0] : from;
  const normalizedFrom = rawFrom?.trim() ?? "";

  return normalizedFrom.startsWith("/products")
    ? normalizedFrom
    : DEFAULT_PRODUCTS_RETURN_HREF;
}
