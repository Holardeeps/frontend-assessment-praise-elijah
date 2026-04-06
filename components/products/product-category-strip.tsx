import type { ProductCategory } from "@/types/api";
import { formatInteger } from "@/lib/utils/format-number";

type ProductCategoryStripProps = {
  categories: ProductCategory[];
};

export function ProductCategoryStrip({
  categories,
}: ProductCategoryStripProps) {
  return (
    <section
      id="categories"
      className="scroll-mt-36 rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
            Categories
          </p>
          <h2 className="mt-2 text-[1.55rem]">
            Browse the catalog by product group
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-copy-soft">
          {formatInteger(categories.length)} categories are ready to explore,
          making it easier for our client&apos;s to move quickly from broad
          browsing to the exact product group they need.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {categories.slice(0, 14).map((category) => (
          <span
            key={category.slug}
            className="pill bg-panel-soft px-3 py-2 text-sm"
          >
            {category.name}
          </span>
        ))}
      </div>
    </section>
  );
}
