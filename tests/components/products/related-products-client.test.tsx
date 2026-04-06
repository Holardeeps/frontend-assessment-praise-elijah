import { screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import { RelatedProductsClient } from "@/components/products/related-products-client";
import { createTradeLensQueryClient } from "@/lib/query/query-client";
import { productQueryKeys } from "@/lib/query/product-query-keys";

import { createTestProduct } from "../../fixtures/products";
import { renderWithProviders } from "../../render-with-providers";

const { mockFetchRelatedProducts } = vi.hoisted(() => ({
  mockFetchRelatedProducts: vi.fn(),
}));

vi.mock("@/lib/query/related-products", () => ({
  fetchRelatedProducts: (...args: unknown[]) => mockFetchRelatedProducts(...args),
}));

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill,
    src,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    src: string;
  }) => {
    void fill;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src} {...props} />
    );
  },
}));

describe("RelatedProductsClient", () => {
  it("renders from the hydrated query cache without refetching", () => {
    const queryClient = createTradeLensQueryClient({
      queries: {
        retry: false,
        gcTime: Number.POSITIVE_INFINITY,
      },
      mutations: {
        retry: false,
      },
    });
    const relatedProduct = createTestProduct({
      id: 202,
      title: "Field Laptop Dock",
      category: "laptops",
      brand: "Checkit Field Systems",
    });

    queryClient.setQueryData(
      productQueryKeys.relatedProducts(101, 3),
      [relatedProduct],
    );

    renderWithProviders(
      <RelatedProductsClient
        category="laptops"
        currentProductId={101}
        limit={3}
        returnHref="/products"
      />,
      { queryClient },
    );

    expect(
      screen.getByRole("heading", { name: /more items from this category/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /field laptop dock/i }),
    ).toHaveAttribute("href", "/products/202?from=%2Fproducts");
    expect(mockFetchRelatedProducts).not.toHaveBeenCalled();
  });
});
