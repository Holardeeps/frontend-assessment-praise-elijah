import Link from "next/link";

import { buildProductsHref } from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

type ProductPaginationProps = {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  query: ProductQueryState;
};

export function ProductPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  query,
}: ProductPaginationProps) {
  const previousPageHref = buildProductsHref(query, { page: page - 1 });
  const nextPageHref = buildProductsHref(query, { page: page + 1 });

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
          Pagination
        </p>
        <p className="mt-2 text-sm leading-6 text-ink">
          Page {page} of {Math.max(totalPages, 1)}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {hasPreviousPage ? (
          <Link href={previousPageHref} className="button-secondary min-w-[9.5rem]">
            Previous page
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 min-w-[9.5rem] items-center justify-center rounded-full border border-line-soft bg-panel px-4 text-sm font-semibold uppercase tracking-[0.08em] text-copy-soft opacity-70"
          >
            Previous page
          </span>
        )}

        {hasNextPage ? (
          <Link href={nextPageHref} className="button-primary min-w-[9.5rem]">
            Next page
          </Link>
        ) : (
          <span
            aria-disabled="true"
            className="inline-flex min-h-12 min-w-[9.5rem] items-center justify-center rounded-full bg-navy px-4 text-sm font-semibold uppercase tracking-[0.08em] text-white opacity-55"
          >
            Next page
          </span>
        )}
      </div>
    </div>
  );
}
