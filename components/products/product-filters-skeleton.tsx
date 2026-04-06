import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductFiltersSkeleton() {
  return (
    <section
      id={PRODUCT_FILTER_SECTION_ID}
      className="scroll-mt-36 rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6"
    >
      <div className="w-full max-w-6xl 2xl:max-w-none">
        <div className="max-w-2xl">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="mt-4 h-9 w-full max-w-lg rounded-full" />
        </div>

        <div className="mt-5 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Skeleton className="h-[4.6rem] rounded-panel-md" />
          <Skeleton className="h-[4.6rem] rounded-panel-md" />
          <Skeleton className="h-[4.6rem] rounded-panel-md" />
          <Skeleton className="h-40 rounded-panel-md md:col-span-2 xl:col-span-3" />
        </div>

        <div className="mt-4 rounded-panel-md border border-line-soft bg-panel-soft px-4 py-3.5">
          <Skeleton className="h-4 w-28 rounded-full" />
          <div className="mt-3 flex flex-wrap gap-2">
            <Skeleton className="h-9 w-36 rounded-full" />
            <Skeleton className="h-9 w-40 rounded-full" />
            <Skeleton className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
