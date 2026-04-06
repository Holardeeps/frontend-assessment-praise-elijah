"use client";

import type { ReactNode } from "react";

import { useUiStore } from "@/store/use-ui-store";

import { ProductViewModeToggle } from "./product-view-mode-toggle";

type ProductResultsViewportProps = {
  children: ReactNode;
};

export function ProductResultsViewport({
  children,
}: ProductResultsViewportProps) {
  const viewMode = useUiStore((state) => state.viewMode);
  const setViewMode = useUiStore((state) => state.setViewMode);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-copy-soft">
          Switch between a visual card grid and a denser compact catalog view.
        </p>

        <ProductViewModeToggle viewMode={viewMode} onChange={setViewMode} />
      </div>

      <div
        data-view-mode={viewMode}
        className={[
          "products-grid",
          viewMode === "compact"
            ? "products-grid-compact"
            : "products-grid-default",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
