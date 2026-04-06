import Link from "next/link";

import { DEFAULT_PRODUCT_QUERY_STATE } from "@/features/products/constants";
import {
  buildProductsHref,
  getActiveProductFilters,
} from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

import { ProductsStatePanel } from "./products-state-panel";

type ProductsEmptyStateProps = {
  query: ProductQueryState;
};

export function ProductsEmptyState({ query }: ProductsEmptyStateProps) {
  const activeFilters = getActiveProductFilters(query);
  const clearFiltersHref = `${buildProductsHref(DEFAULT_PRODUCT_QUERY_STATE)}#results`;

  return (
    <div className="mt-6">
      <ProductsStatePanel
        kicker="No matches"
        title="No products matched this view"
        description="Try broadening the current filters or jump back into the full catalog to find a wider set of products."
        variant="dashed"
        details={
          activeFilters.length > 0 ? (
            <ul aria-label="Active filters" className="flex flex-wrap gap-2">
              {activeFilters.map((filter) => (
                <li key={filter.key}>
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-line-soft bg-panel px-3 py-2 text-xs font-semibold text-ink sm:text-sm">
                    <span className="shrink-0 text-copy-soft">{filter.label}:</span>
                    <span className="max-w-40 truncate sm:max-w-60">{filter.value}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : null
        }
        actions={
          <>
            <Link href={clearFiltersHref} className="button-primary w-full sm:w-auto">
              Clear filters
            </Link>
            <Link href="#filters" className="button-secondary w-full sm:w-auto">
              Adjust filters
            </Link>
          </>
        }
      />
    </div>
  );
}
