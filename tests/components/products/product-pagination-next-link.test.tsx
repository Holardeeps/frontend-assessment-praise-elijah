import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProductPaginationNextLink } from "@/components/products/product-pagination-next-link";
import { createTradeLensQueryClient } from "@/lib/query/query-client";
import { productQueryKeys } from "@/lib/query/product-query-keys";
import type { ProductQueryState } from "@/types/filters";
import type { ProductListResponse } from "@/types/product";

import { renderWithProviders } from "../../render-with-providers";

const nextPageQuery: ProductQueryState = {
  search: "laptop",
  category: "smartphones",
  minPrice: null,
  maxPrice: null,
  sort: "price-desc",
  page: 2,
};

describe("ProductPaginationNextLink", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("prefetches the next catalog page on hover", async () => {
    const queryClient = createTradeLensQueryClient({
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
      },
      mutations: {
        retry: false,
      },
    });
    const payload: ProductListResponse = {
      products: [],
      total: 194,
      page: 2,
      perPage: 24,
      totalPages: 9,
      hasNextPage: true,
      hasPreviousPage: true,
      query: nextPageQuery,
    };
    const fetchMock = vi.mocked(fetch);

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => payload,
    } as Response);

    renderWithProviders(
      <ProductPaginationNextLink
        href="/products?search=laptop&category=smartphones&sort=price-desc&page=2#results"
        query={nextPageQuery}
      />,
      { queryClient },
    );

    fireEvent.mouseEnter(screen.getByRole("link", { name: /next/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/products?search=laptop&category=smartphones&sort=price-desc&page=2",
        {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );
    });

    expect(
      queryClient.getQueryData(productQueryKeys.listing(nextPageQuery)),
    ).toEqual(payload);
  });
});
