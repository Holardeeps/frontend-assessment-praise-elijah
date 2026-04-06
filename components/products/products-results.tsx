import { buildProductDetailHref } from "@/features/products/utils";
import type { ProductListResponse } from "@/types/product";
import { formatInteger } from "@/lib/utils/format-number";

import { ProductCard } from "./product-card";
import { ProductsEmptyState } from "./products-empty-state";
import { ProductPagination } from "./product-pagination";
import { ProductResultsScrollSync } from "./product-results-scroll-sync";
import {
  ProductResultsViewMode,
  PRODUCT_RESULTS_GRID_ID,
} from "./product-results-view-mode";

type ProductsResultsProps = {
  productList: ProductListResponse;
};

export function ProductsResults({ productList }: ProductsResultsProps) {
  return (
    <section
      id="results"
      aria-labelledby="results-title"
      className="animate-reveal animate-reveal-delayed scroll-mt-36"
    >
      <ProductResultsScrollSync />

      <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="section-kicker">
              Results
            </p>
            <h2 id="results-title" className="section-title mt-2">
              Catalog results
            </h2>
          </div>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="max-w-xl text-sm leading-6 text-copy-soft"
          >
            Showing {productList.products.length} products on this page out of{" "}
            {formatInteger(productList.total)} matching items.
          </p>
        </div>

        {productList.products.length > 0 ? (
          <>
            <ProductResultsViewMode />

            <div
              id={PRODUCT_RESULTS_GRID_ID}
              data-view-mode="grid"
              className="products-grid"
            >
              {productList.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={buildProductDetailHref(product.id, productList.query)}
                />
              ))}
            </div>
          </>
        ) : (
          <ProductsEmptyState query={productList.query} />
        )}

        {productList.totalPages > 1 ? (
          <ProductPagination
            page={productList.page}
            totalPages={productList.totalPages}
            hasPreviousPage={productList.hasPreviousPage}
            hasNextPage={productList.hasNextPage}
            query={productList.query}
          />
        ) : null}
      </div>
    </section>
  );
}
