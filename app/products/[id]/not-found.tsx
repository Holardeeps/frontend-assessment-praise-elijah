import Link from "next/link";

import { NavBar } from "@/components/shared/nav-bar";
import { ProductsStatePanel } from "@/components/products/products-state-panel";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

const navItems = [
  { label: "Overview", href: "/products#overview" },
  { label: "Filters", href: `/products#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "/products#results" },
  { label: "Categories", href: "/products#categories" },
];

export default function ProductNotFound() {
  return (
    <main id="main-content" className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: "/products", label: "Back to catalog" }}
      />

      <section className="page-gutter scroll-mt-36 pt-6 sm:pt-8">
        <ProductsStatePanel
          kicker="Product not found"
          title="This product is no longer in the catalog"
          description="The item you tried to open could not be located. It may have been removed or the link you followed could be out of date. Head back to the catalog to keep exploring."
          headingLevel="h1"
          actions={
            <>
              <Link href="/products" className="button-primary w-full sm:w-auto">
                Browse the catalog
              </Link>
              <Link
                href={`/products#${PRODUCT_FILTER_SECTION_ID}`}
                className="button-secondary w-full sm:w-auto"
              >
                Refine your search
              </Link>
            </>
          }
        />
      </section>
    </main>
  );
}
