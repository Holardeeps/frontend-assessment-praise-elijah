import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <article className="rounded-panel-lg border border-line-soft bg-panel p-3 shadow-panel sm:p-4">
      <Skeleton className="aspect-[4/3] w-full rounded-panel-md" />

      <div className="mt-4 flex flex-col gap-3 xs:flex-row xs:items-start xs:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <Skeleton className="h-6 w-4/5 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-3/4 rounded-full" />
        </div>

        <Skeleton className="h-10 w-12 rounded-full" />
      </div>

      <div className="mt-5 grid gap-2 xs:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-20 rounded-panel-md" />
        <Skeleton className="h-20 rounded-panel-md" />
        <Skeleton className="h-20 rounded-panel-md" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
    </article>
  );
}
