"use client";

import { getActiveProductFilters } from "@/features/products/utils";
import { useUiStore } from "@/store/use-ui-store";
import type { ProductQueryState } from "@/types/filters";

import { ProductActiveFilters } from "./product-active-filters";
import { ProductRecentSearches } from "./product-recent-searches";

type ProductFilterContextProps = {
  query: ProductQueryState;
};

export function ProductFilterContext({ query }: ProductFilterContextProps) {
  const hasRecentSearches = useUiStore((state) => state.recentSearches.length > 0);
  const hasActiveFilters = getActiveProductFilters(query).length > 0;

  if (!hasRecentSearches && !hasActiveFilters) {
    return null;
  }

  return (
    <div
      className={
        hasRecentSearches && hasActiveFilters
          ? "mt-4 grid gap-4 md:grid-cols-2"
          : "mt-4"
      }
    >
      {hasRecentSearches ? (
        <ProductRecentSearches
          query={query}
          className={hasActiveFilters ? "h-full" : undefined}
        />
      ) : null}

      {hasActiveFilters ? (
        <ProductActiveFilters
          query={query}
          className={hasRecentSearches ? "h-full" : undefined}
        />
      ) : null}
    </div>
  );
}
