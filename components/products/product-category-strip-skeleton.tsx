import { Skeleton } from "@/components/ui/skeleton";

export function ProductCategoryStripSkeleton() {
  return (
    <section
      id="categories"
      className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6"
    >
      <div>
        <Skeleton className="h-4 w-24 rounded-full" />
        <Skeleton className="mt-4 h-9 w-full max-w-md rounded-full" />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-26 rounded-full" />
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-10 w-30 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </section>
  );
}
