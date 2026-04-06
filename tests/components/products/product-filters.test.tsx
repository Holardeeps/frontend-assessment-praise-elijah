import { act, fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ProductFilterSelect } from "@/components/products/product-filter-select";
import { ProductSearchInput } from "@/components/products/product-search-input";
import { PRODUCT_FILTER_DEBOUNCE_MS } from "@/features/products/constants";
import type { ProductQueryState } from "@/types/filters";

import { renderWithProviders } from "../../render-with-providers";

const { mockReplace, mockUsePathname } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUsePathname: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => mockUsePathname(),
}));

const baseQuery: ProductQueryState = {
  search: "",
  category: "smartphones",
  minPrice: null,
  maxPrice: null,
  sort: "price-desc",
  page: 3,
};

describe("Product filters", () => {
  beforeEach(() => {
    mockReplace.mockReset();
    mockUsePathname.mockReset();
    mockUsePathname.mockReturnValue("/products");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("waits for the debounce window before updating the search URL", async () => {
    vi.useFakeTimers();

    renderWithProviders(<ProductSearchInput query={baseQuery} />);

    const searchInput = screen.getByRole("searchbox", {
      name: /search products/i,
    });

    fireEvent.change(searchInput, {
      target: {
        value: "LAP",
      },
    });

    // This first assertion proves the input value updates immediately in the
    // browser while the route update still waits for the debounce window.
    expect(searchInput).toHaveValue("lap");
    expect(mockReplace).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(PRODUCT_FILTER_DEBOUNCE_MS - 1);
    });

    expect(mockReplace).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(mockReplace).toHaveBeenCalledWith(
      "/products?search=lap&category=smartphones&sort=price-desc",
      { scroll: false },
    );
    expect(mockReplace).toHaveBeenCalledTimes(1);
  });

  it("updates the URL immediately when a sort option is selected", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ProductFilterSelect
        filterKey="sort"
        label="Sort order"
        options={[
          { label: "Default order", value: "" },
          { label: "Price: Low to high", value: "price-asc" },
          { label: "Price: High to low", value: "price-desc" },
        ]}
        query={baseQuery}
        value={baseQuery.sort ?? ""}
      />,
    );

    await user.click(screen.getByRole("button", { name: /sort order/i }));
    await user.click(screen.getByRole("option", { name: /price: low to high/i }));

    expect(mockReplace).toHaveBeenCalledWith(
      "/products?category=smartphones&sort=price-asc",
      { scroll: false },
    );
  });
});
