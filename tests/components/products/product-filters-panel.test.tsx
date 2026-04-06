import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProductFiltersPanel } from "@/components/products/product-filters-panel";
import { useUiStore } from "@/store/use-ui-store";

import { renderWithProviders } from "../../render-with-providers";

const { mockUsePathname, mockUseSearchParams } = vi.hoisted(() => ({
  mockUsePathname: vi.fn(),
  mockUseSearchParams: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useSearchParams: () => mockUseSearchParams(),
}));

describe("ProductFiltersPanel", () => {
  beforeEach(() => {
    mockUsePathname.mockReset();
    mockUseSearchParams.mockReset();
    mockUsePathname.mockReturnValue("/products");
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    window.localStorage.clear();
    useUiStore.setState({
      isFilterDrawerOpen: false,
      recentSearches: [],
      viewMode: "grid",
    });
  });

  it("traps focus inside the mobile drawer and restores focus to the trigger on escape", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <ProductFiltersPanel activeFilterCount={2}>
        <button type="button">Inner action</button>
      </ProductFiltersPanel>,
    );

    const trigger = screen.getByRole("button", { name: /open filters panel/i });

    await user.click(trigger);

    const dialog = screen.getByRole("dialog", { name: /refine results/i });
    const closeButton = screen.getByRole("button", {
      name: /close filters panel/i,
    });
    const innerAction = screen.getByRole("button", { name: /inner action/i });

    expect(dialog).toBeInTheDocument();
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(innerAction).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
