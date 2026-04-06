"use client";

import { useEffect } from "react";

import { useUiStore } from "@/store/use-ui-store";

import { ProductViewModeToggle } from "./product-view-mode-toggle";

export const PRODUCT_RESULTS_GRID_ID = "products-results-grid";

export function ProductResultsViewMode() {
  const viewMode = useUiStore((state) => state.viewMode);
  const setViewMode = useUiStore((state) => state.setViewMode);

  useEffect(() => {
    const resultsGrid = document.getElementById(PRODUCT_RESULTS_GRID_ID);

    if (!resultsGrid) {
      return;
    }

    resultsGrid.setAttribute("data-view-mode", viewMode);
  }, [viewMode]);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-copy-soft">
          Switch between a visual card grid and a denser compact catalog view.
        </p>

        <ProductViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </div>
    </div>
  );
}
