"use client";

import type { ProductViewMode } from "@/types/ui";

type ProductViewModeToggleProps = {
  viewMode: ProductViewMode;
  onChange: (viewMode: ProductViewMode) => void;
};

export function ProductViewModeToggle({
  viewMode,
  onChange,
}: ProductViewModeToggleProps) {
  return (
    <div
      className="inline-flex rounded-full border border-line-soft bg-panel-soft p-1"
      aria-label="Catalog view mode"
      role="group"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={[
          "min-h-10 rounded-full px-4 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ease-fluid",
          viewMode === "grid"
            ? "bg-cyan text-navy"
            : "text-copy-soft hover:text-ink",
        ].join(" ")}
        aria-pressed={viewMode === "grid"}
      >
        Grid
      </button>

      <button
        type="button"
        onClick={() => onChange("compact")}
        className={[
          "min-h-10 rounded-full px-4 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ease-fluid",
          viewMode === "compact"
            ? "bg-cyan text-navy"
            : "text-copy-soft hover:text-ink",
        ].join(" ")}
        aria-pressed={viewMode === "compact"}
      >
        Compact
      </button>
    </div>
  );
}
