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
      onMouseEnter={prefetchNextPage}
      onFocus={prefetchNextPage}
      aria-label="Go to next page"
      className="button-primary min-h-11 min-w-11 px-0 sm:min-h-12 sm:min-w-35 sm:px-4"
    >
      <span aria-hidden="true" className="text-base sm:hidden">
        →
      </span>
      <span className="sr-only sm:not-sr-only">Next</span>
    </Link>
  );
}
