import { ProductCardSkeleton } from "./product-card-skeleton";

export function RelatedProductsSkeleton() {
  return (
    <section
      aria-label="Loading related products"
      className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6 sm:py-6"
    >
      <div className="space-y-3">
        <p className="section-kicker">Related products</p>
        <div className="skeleton-block h-9 w-64 rounded-full" />
        <div className="skeleton-block h-4 w-full rounded-full" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ProductCardSkeleton />
        <ProductCardSkeleton />
        <ProductCardSkeleton />
      </div>
    </section>
  );
}
