"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import { fetchProductListQuery } from "@/lib/query/products-list";
import { productQueryKeys } from "@/lib/query/product-query-keys";
import type { ProductQueryState } from "@/types/filters";

type ProductPaginationNextLinkProps = {
  href: string;
  query: ProductQueryState;
};

export function ProductPaginationNextLink({
  href,
  query,
}: ProductPaginationNextLinkProps) {
  const queryClient = useQueryClient();
  const className =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-cyan px-0 text-sm font-semibold uppercase tracking-wide text-navy shadow-panel transition-colors duration-150 ease-fluid hover:bg-navy hover:text-white sm:min-h-12 sm:min-w-35 sm:px-4";

  const prefetchNextPage = () => {
    // This prefetch only runs when someone shows intent to continue paging, so
    // the next page gets a warm cache without adding extra background work on
    // every results screen automatically.
    void queryClient.prefetchQuery({
      queryKey: productQueryKeys.listing(query),
      queryFn: () => fetchProductListQuery(query),
      staleTime: 60_000,
    });
  };

  return (
    <Link
      href={href}
      prefetch={false}
      scroll={false}
      onMouseEnter={prefetchNextPage}
      onFocus={prefetchNextPage}
      aria-label="Go to next page"
      className={className}
    >
      <span aria-hidden="true" className="text-base sm:hidden">
        →
      </span>
      <span className="sr-only sm:not-sr-only">Next</span>
    </Link>
  );
}
