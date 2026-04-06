import { screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { vi } from "vitest";

import { ProductCard } from "@/components/products/product-card";

import { createTestProduct } from "../../fixtures/products";
import { renderWithProviders } from "../../render-with-providers";

// This mock keeps the test focused on ProductCard behavior instead of Next's
// image implementation details by rendering next/image as a plain img element.
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

describe("ProductCard", () => {
  it("renders the main product content and metadata", () => {
    renderWithProviders(<ProductCard product={createTestProduct()} />);

    expect(
      screen.getByRole("img", { name: /trade monitor display/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /trade monitor display/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/smartphones/i)).toBeInTheDocument();
    expect(screen.getByText(/checkit supply/i)).toBeInTheDocument();
    expect(screen.getByText(/\$1,299\.00/i)).toBeInTheDocument();
    expect(screen.getByText(/48 available/i)).toBeInTheDocument();
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
    expect(screen.getByText(/13% off/i)).toBeInTheDocument();
    expect(screen.getByText(/^4\.6$/i)).toBeInTheDocument();
    expect(screen.getByText(/^rating 4\.6$/i)).toBeInTheDocument();
  });

  it("shows the fallback preview when no image is available", () => {
    renderWithProviders(
      <ProductCard
        product={createTestProduct({
          images: [],
          thumbnail: "",
        })}
      />,
    );

    expect(
      screen.getByText(/preview unavailable for this item right now/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("img", { name: /trade monitor display/i }),
    ).not.toBeInTheDocument();
  });
});
