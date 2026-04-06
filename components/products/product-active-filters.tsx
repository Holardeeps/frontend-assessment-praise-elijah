import Link from "next/link";

import {
  DEFAULT_PRODUCT_QUERY_STATE,
  PRODUCT_FILTER_SECTION_ID,
} from "@/features/products/constants";
import {
  buildProductsHref,
  getActiveProductFilters,
} from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

type ProductActiveFiltersProps = {
  query: ProductQueryState;
};

export function ProductActiveFilters({ query }: ProductActiveFiltersProps) {
  const activeFilters = getActiveProductFilters(query);

  if (activeFilters.length === 0) {
    return (
      <div className="mt-4 rounded-panel-md border border-dashed border-line-soft bg-panel-soft px-4 py-3">
        <p className="metric-kicker">Current view</p>
        <p className="mt-2 text-sm leading-6 text-copy-soft">
          No filters are active right now, so this view is showing the full
          catalog.
        </p>
      </div>
    );
  }

  const clearFiltersHref = `${buildProductsHref(DEFAULT_PRODUCT_QUERY_STATE)}#${PRODUCT_FILTER_SECTION_ID}`;

  return (
    <div className="mt-4 rounded-panel-md border border-line-soft bg-panel-soft px-4 py-3.5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="metric-kicker">Current view</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <span
                key={filter.key}
                className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line-soft bg-panel px-3 py-2 text-xs font-semibold text-ink sm:text-sm"
              >
                <span className="shrink-0 text-copy-soft">{filter.label}:</span>
                <span className="max-w-36 truncate sm:max-w-52">{filter.value}</span>
              </span>
            ))}
          </div>
        </div>

        <Link href={clearFiltersHref} className="button-secondary w-full md:w-auto">
          Clear filters
        </Link>
      </div>
    </div>
  );
}
