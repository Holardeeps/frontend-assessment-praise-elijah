"use client";

import Link from "next/link";
import { useEffect } from "react";

import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

import { ProductsStatePanel } from "./products-state-panel";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Filters", href: `#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "#results" },
  { label: "Categories", href: "#categories" },
];

type ProductsRouteErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export function ProductsRouteError({
  error,
  unstable_retry,
}: ProductsRouteErrorProps) {
  // This keeps unexpected route errors visible in local logs while the UI
  // shows a safe recovery state for people using the product.
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: "#results", label: "View results" }}
      />

      <section id="results" className="page-gutter scroll-mt-36 pt-6 sm:pt-8">
        <ProductsStatePanel
          kicker="Results"
          title="Something interrupted this catalog view"
          description="The page hit an unexpected issue while loading this route. Try the current view again, or return to the full catalog and restart from a stable view."
          headingLevel="h2"
          actions={
            <>
              <button
                type="button"
                className="button-primary w-full sm:w-auto"
                onClick={() => unstable_retry()}
              >
                Try again
              </button>
              <Link href="/products" className="button-secondary w-full sm:w-auto">
                Open full catalog
              </Link>
            </>
          }
          details={
            error.digest ? (
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">
                Reference {error.digest}
              </p>
            ) : null
          }
        />
      </section>
    </main>
  );
}
