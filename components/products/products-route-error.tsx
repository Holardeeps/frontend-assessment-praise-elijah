"use client";

import Link from "next/link";
import { useEffect } from "react";

import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

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
    <main className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: "#results", label: "View results" }}
      />

      <section id="results" className="page-gutter scroll-mt-36 pt-6 sm:pt-8">
        <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-8 shadow-panel sm:px-6">
          <p className="section-kicker">Results</p>
          <h1 className="mt-2 max-w-2xl text-[clamp(2rem,1.65rem+1.4vw,3rem)]">
            Something interrupted this catalog view
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-copy-soft sm:text-base">
            The page hit an unexpected issue while loading this route. Try the
            current view again, or return to the full catalog and restart from a
            stable view.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
          </div>

          {error.digest ? (
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-copy-soft">
              Reference {error.digest}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
