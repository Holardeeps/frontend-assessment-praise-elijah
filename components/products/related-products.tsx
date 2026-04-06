import { buildProductDetailHrefFromReturnHref } from "@/features/products/utils";
import { getRelatedProductsByCategory, ProductsApiError } from "@/lib/api/products";

import { ProductCard } from "./product-card";

type RelatedProductsProps = {
  category: string;
  currentProductId: number;
  returnHref: string;
};

export async function RelatedProducts({
  category,
  currentProductId,
  returnHref,
}: RelatedProductsProps) {
  let relatedProducts;

  try {
    relatedProducts = await getRelatedProductsByCategory(category, {
      excludeProductId: currentProductId,
      limit: 3,
    });
  } catch (error) {
    if (error instanceof ProductsApiError) {
      return <RelatedProductsMessage kind="unavailable" />;
    }

    throw error;
  }

  if (relatedProducts.length === 0) {
    return <RelatedProductsMessage kind="empty" />;
  }

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
        {relatedProducts.map((product) => (
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

function RelatedProductsMessage({ kind }: RelatedProductsMessageProps) {
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
