import { Skeleton } from "@/components/ui/skeleton";

import { ProductCardSkeleton } from "./product-card-skeleton";

type ProductsResultsSkeletonProps = {
  cardCount?: number;
};

export function ProductsResultsSkeleton({
  cardCount = 6,
}: ProductsResultsSkeletonProps) {
  return (
    <section id="results" className="scroll-mt-36">
      <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="mt-4 h-9 w-52 rounded-full" />
          </div>
          <div className="w-full max-w-xl">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="mt-2 h-4 w-3/4 rounded-full" />
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: cardCount }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>

        <div className="mt-6 rounded-panel-lg border border-line-soft bg-panel px-4 py-4 shadow-panel sm:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="mt-3 h-4 w-28 rounded-full" />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
              <Skeleton className="h-11 w-11 rounded-full sm:h-12 sm:w-35" />
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="h-11 w-11 rounded-full" />
              <Skeleton className="h-11 w-11 rounded-full sm:h-12 sm:w-35" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
