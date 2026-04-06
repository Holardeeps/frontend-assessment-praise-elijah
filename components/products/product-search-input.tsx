"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCT_FILTER_DEBOUNCE_MS } from "@/features/products/constants";
import { useDebouncedValue } from "@/features/products/hooks/use-debounced-value";
import { buildProductsFilterHref, buildProductsHref } from "@/features/products/utils";
import { useUiStore } from "@/store/use-ui-store";
import type { ProductQueryState } from "@/types/filters";

type ProductSearchInputProps = {
  query: ProductQueryState;
};

export function ProductSearchInput({ query }: ProductSearchInputProps) {
  const router = useRouter();
  const addRecentSearch = useUiStore((state) => state.addRecentSearch);
  const lastAppliedHrefRef = useRef<string | null>(null);
  const [searchText, setSearchText] = useState(() => query.search);
  const debouncedSearchText = useDebouncedValue(
    searchText,
    PRODUCT_FILTER_DEBOUNCE_MS,
  );
  const currentHref = buildProductsHref(query);

  // This applies the debounced search value back into the URL so the server
  // page remains the source of truth for the listing results.
  useEffect(() => {
    const normalizedSearchText = debouncedSearchText.trim().toLowerCase();

    if (normalizedSearchText === query.search) {
      return;
    }

    const nextHref = buildProductsFilterHref(query, {
      search: normalizedSearchText,
    });

    if (
      nextHref === currentHref ||
      lastAppliedHrefRef.current === nextHref
    ) {
      return;
    }

    if (normalizedSearchText.length > 0) {
      addRecentSearch(normalizedSearchText);
    }

    lastAppliedHrefRef.current = nextHref;
    router.replace(nextHref, { scroll: false });
  }, [addRecentSearch, currentHref, debouncedSearchText, query, router]);

  return (
    <label className="field-shell">
      <span className="metric-kicker">Search products</span>
      <input
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value.toLowerCase())}
        placeholder="Search by product name or keyword"
        className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-copy-soft sm:text-base"
      />
    </label>
  );
}
