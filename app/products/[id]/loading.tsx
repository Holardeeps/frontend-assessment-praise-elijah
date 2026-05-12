import { ProductDetailOverviewSkeleton } from "@/components/products/product-detail-overview-skeleton";
import { RelatedProductsSkeleton } from "@/components/products/related-products-skeleton";
import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

const navItems = [
  { label: "Overview", href: "/products#overview" },
  { label: "Filters", href: `/products#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "/products#results" },
  { label: "Categories", href: "/products#categories" },
];

export default function Loading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      className="pb-14 sm:pb-16 lg:pb-20"
    >
      <NavBar
        items={navItems}
        cta={{ href: "/products", label: "Back to catalog" }}
      />

      <section className="page-gutter space-y-8 pt-6 sm:pt-8">
        <ProductDetailOverviewSkeleton />
        <RelatedProductsSkeleton />
      </section>
    </main>
  );
}
