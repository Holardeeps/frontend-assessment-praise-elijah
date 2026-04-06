"use client";

import { useRouter } from "next/navigation";

import { buildProductsFilterHref } from "@/features/products/utils";
import { useUiStore } from "@/store/use-ui-store";
import type { ProductQueryState } from "@/types/filters";

type ProductRecentSearchesProps = {
  query: ProductQueryState;
  className?: string;
};

export function ProductRecentSearches({
  query,
  className,
}: ProductRecentSearchesProps) {
  const router = useRouter();
  const recentSearches = useUiStore((state) => state.recentSearches);
  const clearRecentSearches = useUiStore((state) => state.clearRecentSearches);

  if (recentSearches.length === 0) {
    return null;
  }

  // These chips keep recent searches discoverable without replacing the URL
  // flow, so selecting one still re-renders the server results page cleanly.
  const handleSelectSearch = (search: string) => {
    if (search === query.search) {
      return;
    }

    const nextHref = buildProductsFilterHref(query, { search });
    router.replace(nextHref, { scroll: false });
  };

  return (
    <div
      className={[
        "rounded-panel-md border border-line-soft bg-panel-soft px-4 py-3.5",
        className ?? "",
      ].join(" ")}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="metric-kicker">Recent searches</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {recentSearches.map((search) => {
              const isActive = search === query.search;

              return (
                <button
                  key={search}
                  type="button"
                  onClick={() => handleSelectSearch(search)}
                  className={[
                    "inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold transition-colors duration-150 ease-fluid",
                    isActive
                      ? "border-cyan bg-cyan text-navy"
                      : "border-line-soft bg-panel text-ink hover:border-line-strong hover:bg-panel-soft",
                  ].join(" ")}
                  aria-pressed={isActive}
                >
                  {search}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={clearRecentSearches}
          className="button-secondary w-full md:w-auto"
        >
          Clear recent
        </button>
      </div>
    </div>
  );
}
