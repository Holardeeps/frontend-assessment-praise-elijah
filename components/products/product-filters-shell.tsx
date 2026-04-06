import {
  PRODUCT_FILTER_DEFINITIONS,
  PRODUCT_FILTER_SECTION_ID,
  PRODUCT_SORT_OPTIONS,
} from "@/features/products/constants";
import { getProductFilterPreviews } from "@/features/products/utils";
import type { ProductCategory } from "@/types/api";
import type { ProductQueryState } from "@/types/filters";

import { ProductFilterSelect } from "./product-filter-select";
import { ProductActiveFilters } from "./product-active-filters";
import { ProductPriceRangeInput } from "./product-price-range-input";
import { ProductSearchInput } from "./product-search-input";

type ProductFiltersShellProps = {
  categories: ProductCategory[];
  query: ProductQueryState;
  categoryCount: number;
};

export function ProductFiltersShell({
  categories,
  query,
  categoryCount,
}: ProductFiltersShellProps) {
  void categoryCount;
  const filterPreviews = getProductFilterPreviews(query);
  const categoryOptions = [
    { label: "All categories", value: "" },
    ...categories.map((category) => ({
      label: category.name,
      value: category.slug,
    })),
  ];
  const sortOptions = [
    { label: "Default order", value: "" },
    ...PRODUCT_SORT_OPTIONS.map((option) => ({
      label: option.label,
      value: option.value,
    })),
  ];
  const priceFilter = PRODUCT_FILTER_DEFINITIONS.find(
    (filter) => filter.key === "priceRange",
  );

  return (
    <section
      id={PRODUCT_FILTER_SECTION_ID}
      className="scroll-mt-36 rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6"
    >
      <div className="w-full max-w-6xl 2xl:max-w-none">
        <div className="max-w-2xl">
          <p className="section-kicker">Refine results</p>
          <h2 className="section-title mt-2">Shape the catalog around what matters most</h2>
        </div>

        <div className="mt-5 grid items-start gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.18fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <ProductSearchInput key={query.search} query={query} />

          <ProductFilterSelect
            filterKey="category"
            label="Category"
            options={categoryOptions}
            query={query}
            value={query.category ?? ""}
          />

          <ProductFilterSelect
            filterKey="sort"
            label="Sort order"
            options={sortOptions}
            query={query}
            value={query.sort ?? ""}
          />

          {priceFilter ? (
            <ProductPriceRangeInput
              key={`${query.minPrice ?? "none"}-${query.maxPrice ?? "none"}`}
              className="md:col-span-2 xl:col-span-3"
              label={priceFilter.label}
              description={priceFilter.description}
              preview={filterPreviews.priceRange}
              query={query}
            />
          ) : null}
        </div>

        <ProductActiveFilters query={query} />
      </div>
    </section>
  );
}
