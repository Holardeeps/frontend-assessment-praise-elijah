import Link from "next/link";

import {
  buildProductsHref,
  getPaginationWindow,
} from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

import { ProductPaginationNextLink } from "./product-pagination-next-link";

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
  const previousPageHref = `${buildProductsHref(query, { page: page - 1 })}#results`;
  const nextPageHref = `${buildProductsHref(query, { page: page + 1 })}#results`;
  const nextPageQuery: ProductQueryState = {
    ...query,
    page: page + 1,
  };
  const visiblePages = getPaginationWindow(page, totalPages);
  const compactVisiblePages = hasPreviousPage
    ? [page - 1, page]
    : hasNextPage
      ? [page, page + 1]
      : [page];
  const mobileActionClassName =
    "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-0 text-sm font-semibold uppercase tracking-wide transition-colors duration-150 ease-fluid sm:min-h-12 sm:min-w-35 sm:px-4";
  const previousActionClassName = `${mobileActionClassName} border border-line-soft bg-panel-soft text-ink hover:border-line-strong hover:bg-panel`;
  const previousDisabledClassName = `${mobileActionClassName} border border-line-soft bg-panel-soft text-copy-soft opacity-70`;
  const pageClassName =
    "inline-flex min-h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-semibold transition-colors duration-150 ease-fluid sm:min-h-11 sm:min-w-11";
  const currentPageClassName = `${pageClassName} bg-navy text-white shadow-panel`;
  const defaultPageClassName = `${pageClassName} border border-line-soft bg-panel-soft text-ink hover:border-line-strong hover:bg-panel`;

  return (
    <nav
      aria-label="Catalog pagination"
      className="mt-6 rounded-panel-lg border border-line-soft bg-panel px-4 py-4 shadow-panel sm:px-5"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="metric-kicker">
            Pagination
          </p>
          <p className="mt-2 text-sm leading-6 text-ink">
            Page {page} of {Math.max(totalPages, 1)}
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 lg:w-auto lg:items-end">
          <div className="grid w-full grid-cols-[2.75rem_minmax(0,1fr)_2.75rem] items-center gap-3 sm:grid-cols-[8.75rem_minmax(0,1fr)_8.75rem] lg:w-auto">
            {hasPreviousPage ? (
              <Link
                href={previousPageHref}
                prefetch={false}
                scroll={false}
                aria-label="Go to previous page"
                className={previousActionClassName}
              >
                <span aria-hidden="true" className="text-base sm:hidden">
                  ←
                </span>
                <span className="sr-only sm:not-sr-only">Previous</span>
              </Link>
            ) : (
              <span
                aria-disabled="true"
                className={previousDisabledClassName}
              >
                <span aria-hidden="true" className="text-base sm:hidden">
                  ←
                </span>
                <span className="sr-only sm:not-sr-only">Previous</span>
              </span>
            )}

            <div className="flex items-center justify-center gap-2 2xs:hidden">
              {compactVisiblePages.map((pageItem) => {
                const pageHref = buildProductsHref(query, { page: pageItem });
                const isCurrentPage = pageItem === page;

                return (
                  <Link
                    key={`compact-${pageItem}`}
                    href={`${pageHref}#results`}
                    prefetch={false}
                    scroll={false}
                    aria-current={isCurrentPage ? "page" : undefined}
                    aria-label={
                      isCurrentPage
                        ? `Page ${pageItem}, current page`
                        : `Go to page ${pageItem}`
                    }
                    className={
                      isCurrentPage ? currentPageClassName : defaultPageClassName
                    }
                  >
                    {pageItem}
                  </Link>
                );
              })}
            </div>

            <div className="hidden flex-wrap items-center justify-center gap-2 2xs:flex sm:flex-nowrap">
              {visiblePages.map((pageItem) => {
                if (typeof pageItem !== "number") {
                  return (
                    <span
                      key={pageItem}
                      aria-hidden="true"
                      className="inline-flex min-h-10 min-w-8 items-center justify-center text-sm font-semibold text-copy-soft sm:min-h-11 sm:min-w-11"
                    >
                      ...
                    </span>
                  );
                }

                const pageHref = buildProductsHref(query, { page: pageItem });
                const isCurrentPage = pageItem === page;

                return (
                  <Link
                    key={pageItem}
                    href={`${pageHref}#results`}
                    prefetch={false}
                    scroll={false}
                    aria-current={isCurrentPage ? "page" : undefined}
                    aria-label={
                      isCurrentPage
                        ? `Page ${pageItem}, current page`
                        : `Go to page ${pageItem}`
                    }
                    className={
                      isCurrentPage ? currentPageClassName : defaultPageClassName
                    }
                  >
                    {pageItem}
                  </Link>
                );
              })}
            </div>

            {hasNextPage ? (
              <ProductPaginationNextLink
                href={nextPageHref}
                query={nextPageQuery}
              />
            ) : (
              <span
                aria-disabled="true"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-navy px-0 text-sm font-semibold uppercase tracking-wide text-white opacity-55 sm:min-h-12 sm:min-w-35 sm:px-4"
              >
                <span aria-hidden="true" className="text-base sm:hidden">
                  →
                </span>
                <span className="sr-only sm:not-sr-only">Next</span>
              </span>
            )}
          </div>

          {/* <p className="text-sm leading-6 text-copy-soft">
            Keep browsing the same set of matching products as you move through pages.
          </p> */}
        </div>
      </div>
    </nav>
  );
}
