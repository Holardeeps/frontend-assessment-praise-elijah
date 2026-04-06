import { buildProductDetailHrefFromReturnHref } from "@/features/products/utils";
import type { Product } from "@/types/product";

import { ProductCard } from "./product-card";

type RelatedProductsContentProps = {
  products: Product[];
  returnHref: string;
};

export function RelatedProductsContent({
  products,
  returnHref,
}: RelatedProductsContentProps) {
  return (
    <section className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6 sm:py-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-kicker">Related products</p>
          <h2 className="section-title mt-2">More items from this category</h2>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-copy-soft">
          Keep exploring nearby products without leaving this catalog flow.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            href={buildProductDetailHrefFromReturnHref(product.id, returnHref)}
          />
        ))}
      </div>
    </section>
  );
}

type RelatedProductsMessageProps = {
  kind: "empty" | "unavailable";
};

export function RelatedProductsMessage({ kind }: RelatedProductsMessageProps) {
  const description =
    kind === "empty"
      ? "Additional products from this group are not available right now."
      : "Related recommendations are taking longer than expected. The main product details are still ready above.";

  return (
    <section className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6 sm:py-6">
      <div className="space-y-3">
        <p className="section-kicker">Related products</p>
        <h2 className="section-title">More items from this category</h2>
        <p className="max-w-2xl text-sm leading-6 text-copy-soft">
          {description}
        </p>
      </div>
    </section>
  );
}
