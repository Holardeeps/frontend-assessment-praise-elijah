import type { RelatedProductsApiResponse } from "@/types/api";

export class RelatedProductsQueryError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "RelatedProductsQueryError";
    this.status = status;
  }
}

export async function fetchRelatedProducts(
  productId: number,
  limit: number,
) {
  const response = await fetch(
    `/api/products/${productId}/related?limit=${limit}`,
    {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new RelatedProductsQueryError(
      "Related products are temporarily unavailable.",
      response.status,
    );
  }

  const data = (await response.json()) as RelatedProductsApiResponse;

  return data.products;
}
