"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCT_FILTER_DEBOUNCE_MS } from "@/features/products/constants";
import { useDebouncedValue } from "@/features/products/hooks/use-debounced-value";
import { buildProductsFilterHref } from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

type ProductSearchInputProps = {
  query: ProductQueryState;
};

export function ProductSearchInput({ query }: ProductSearchInputProps) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(() => query.search);
  const debouncedSearchText = useDebouncedValue(
    searchText,
    PRODUCT_FILTER_DEBOUNCE_MS,
  );

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

    router.replace(nextHref, { scroll: false });
  }, [debouncedSearchText, query, router]);

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
