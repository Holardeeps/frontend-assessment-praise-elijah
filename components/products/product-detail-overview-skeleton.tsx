import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailOverviewSkeleton() {
  return (
    <section aria-label="Loading product details" className="space-y-5">
      <Skeleton className="h-5 w-56 rounded-full" />

      <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6 sm:py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
          <Skeleton className="aspect-[4/3] w-full rounded-panel-lg" />

          <div className="space-y-5">
            <div className="space-y-3">
              <Skeleton className="h-4 w-32 rounded-full" />
              <div className="flex flex-wrap items-center gap-2">
                <Skeleton className="h-9 w-28 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full max-w-2xl rounded-full" />
              <Skeleton className="h-10 w-3/4 max-w-xl rounded-full" />
              <Skeleton className="h-4 w-full max-w-3xl rounded-full" />
              <Skeleton className="h-4 w-5/6 max-w-2xl rounded-full" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-panel-md" />
              ))}
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <Skeleton className="h-44 rounded-panel-md" />
              <Skeleton className="h-44 rounded-panel-md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
