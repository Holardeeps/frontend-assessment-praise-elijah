import type { ProductCategory } from "@/types/api";

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
      <div>
        <p className="section-kicker">Categories</p>
        <h2 className="section-title mt-2">
          Browse the catalog by product group
        </h2>
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
