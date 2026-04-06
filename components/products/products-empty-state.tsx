import Link from "next/link";

import { DEFAULT_PRODUCT_QUERY_STATE } from "@/features/products/constants";
import {
  buildProductsHref,
  getActiveProductFilters,
} from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

type ProductsEmptyStateProps = {
  query: ProductQueryState;
};

export function ProductsEmptyState({ query }: ProductsEmptyStateProps) {
  const activeFilters = getActiveProductFilters(query);
  const clearFiltersHref = `${buildProductsHref(DEFAULT_PRODUCT_QUERY_STATE)}#results`;

  return (
    <div className="mt-6 rounded-panel-lg border border-dashed border-line-strong bg-panel-soft px-5 py-8 sm:px-6 sm:py-10">
      <p className="section-kicker">No matches</p>
      <h3 className="mt-2 text-[clamp(1.5rem,1.3rem+0.8vw,2rem)]">
        No products matched this view
      </h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-copy-soft sm:text-base">
        Try broadening the current filters or jump back into the full catalog to
        find a wider set of products.
      </p>

      {activeFilters.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <span
              key={filter.key}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line-soft bg-panel px-3 py-2 text-xs font-semibold text-ink sm:text-sm"
            >
              <span className="shrink-0 text-copy-soft">{filter.label}:</span>
              <span className="max-w-40 truncate sm:max-w-60">{filter.value}</span>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link href={clearFiltersHref} className="button-primary w-full sm:w-auto">
          Clear filters
        </Link>
        <Link href="#filters" className="button-secondary w-full sm:w-auto">
          Adjust filters
        </Link>
      </div>
    </div>
  );
}
