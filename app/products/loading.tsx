import { ProductCategoryStripSkeleton } from "@/components/products/product-category-strip-skeleton";
import { ProductFiltersSkeleton } from "@/components/products/product-filters-skeleton";
import { ProductsOverviewSkeleton } from "@/components/products/products-overview-skeleton";
import { ProductsResultsSkeleton } from "@/components/products/products-results-skeleton";
import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Filters", href: `#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "#results" },
  { label: "Categories", href: "#categories" },
];

export default function Loading() {
  return (
    <main aria-busy="true" className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: "#results", label: "View results" }}
      />

      <section className="page-gutter space-y-8 pt-6 sm:pt-8">
        <ProductsOverviewSkeleton />
        <ProductFiltersSkeleton />
        <ProductCategoryStripSkeleton />
        <ProductsResultsSkeleton />
      </section>
    </main>
  );
}
