import type { ProductQueryState } from "@/types/filters";

import { toProductSearchParams } from "./parse-product-query";

type ProductQueryOverrides = Partial<ProductQueryState>;

// This builds shareable /products URLs from typed query state so pagination
// and later filter links can preserve the current catalog view cleanly.
export function buildProductsHref(
  query: ProductQueryState,
  overrides: ProductQueryOverrides = {},
) {
  const nextQueryState: ProductQueryState = {
    ...query,
    ...overrides,
  };
  const searchParams = new URLSearchParams(toProductSearchParams(nextQueryState));
  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/products?${queryString}` : "/products";
}
