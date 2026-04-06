import type { ProductListResponse } from "@/types/product";
import { formatInteger } from "@/lib/utils/format-number";

import { ProductCard } from "./product-card";
import { ProductPagination } from "./product-pagination";

type ProductsResultsProps = {
  productList: ProductListResponse;
};

export function ProductsResults({ productList }: ProductsResultsProps) {
  return (
    <section
      id="results"
      className="scroll-mt-36 animate-reveal [animation-delay:120ms]"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
            Results
          </p>
          <h2 className="mt-2 text-[1.55rem]">Catalog results</h2>
        </div>
        <p className="text-sm leading-6 text-copy-soft">
          Showing {productList.products.length} products on this page out of{" "}
          {formatInteger(productList.total)} matching items.
        </p>
      </div>

      {productList.products.length > 0 ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {productList.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-panel-lg border border-dashed border-line-strong bg-panel-soft px-5 py-10 text-center">
          <h3>No products matched this view.</h3>
          <p className="mt-3 text-sm leading-6 text-copy-soft">
            Try a broader search or return to the full catalog to keep exploring.
          </p>
        </div>
      )}

      <ProductPagination
        page={productList.page}
        totalPages={productList.totalPages}
        hasPreviousPage={productList.hasPreviousPage}
        hasNextPage={productList.hasNextPage}
        query={productList.query}
      />
    </section>
  );
}
