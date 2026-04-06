import { toProductSearchParams } from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";
import type { ProductListResponse } from "@/types/product";

export class ProductListQueryError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ProductListQueryError";
    this.status = status;
  }
}

export async function fetchProductListQuery(query: ProductQueryState) {
  const searchParams = new URLSearchParams(toProductSearchParams(query));
  const requestUrl =
    searchParams.size > 0
      ? `/api/products?${searchParams.toString()}`
      : "/api/products";
  const response = await fetch(requestUrl, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new ProductListQueryError(
      "Catalog results are temporarily unavailable.",
      response.status,
    );
  }

  return (await response.json()) as ProductListResponse;
}
