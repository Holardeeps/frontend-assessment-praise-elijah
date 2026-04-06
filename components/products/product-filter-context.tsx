"use client";

import { useUiStore } from "@/store/use-ui-store";
import type { ProductQueryState } from "@/types/filters";

import { ProductActiveFilters } from "./product-active-filters";
import { ProductRecentSearches } from "./product-recent-searches";

type ProductFilterContextProps = {
  query: ProductQueryState;
};

export function ProductFilterContext({ query }: ProductFilterContextProps) {
  const hasRecentSearches = useUiStore((state) => state.recentSearches.length > 0);

  return (
    <div className={hasRecentSearches ? "mt-4 grid gap-4 md:grid-cols-2" : "mt-4"}>
      {hasRecentSearches ? (
        <ProductRecentSearches query={query} className="h-full" />
      ) : null}

      <ProductActiveFilters query={query} className={hasRecentSearches ? "h-full" : undefined} />
    </div>
  );
}
