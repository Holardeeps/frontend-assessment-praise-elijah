import { Skeleton } from "@/components/ui/skeleton";

export function ProductsOverviewSkeleton() {
  return (
    <section className="max-w-5xl">
      <Skeleton className="h-10 w-36 rounded-full" />

      <div className="mt-6 space-y-4">
        <Skeleton className="h-12 w-full max-w-4xl rounded-full" />
        <Skeleton className="h-12 w-11/12 max-w-3xl rounded-full" />
        <Skeleton className="h-5 w-full max-w-3xl rounded-full" />
        <Skeleton className="h-5 w-5/6 max-w-2xl rounded-full" />
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-12 w-40 rounded-full" />
        <Skeleton className="h-12 w-44 rounded-full" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 rounded-panel-md" />
        <Skeleton className="h-28 rounded-panel-md" />
        <Skeleton className="h-28 rounded-panel-md" />
        <Skeleton className="h-28 rounded-panel-md" />
      </div>

      <div className="mt-6 rounded-panel-md border border-line-soft bg-panel px-4 py-4">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="mt-4 h-4 w-full rounded-full" />
        <Skeleton className="mt-2 h-4 w-5/6 rounded-full" />
      </div>
    </section>
  );
}
