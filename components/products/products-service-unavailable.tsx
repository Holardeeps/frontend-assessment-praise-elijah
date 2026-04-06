import Link from "next/link";

import { ProductsStatePanel } from "./products-state-panel";

type ProductsServiceUnavailableProps = {
  retryHref: string;
  resetHref: string;
};

export function ProductsServiceUnavailable({
  retryHref,
  resetHref,
}: ProductsServiceUnavailableProps) {
  return (
    <section
      id="results"
      className="animate-reveal animate-reveal-delayed scroll-mt-36"
    >
      <ProductsStatePanel
        kicker="Results"
        title="The catalog is taking longer than expected"
        description="The product service did not respond in time. Try this view again, or return to the full catalog and retry from a simpler starting point."
        headingLevel="h2"
        actions={
          <>
            <Link href={retryHref} className="button-primary w-full sm:w-auto">
              Try again
            </Link>
            <Link href={resetHref} className="button-secondary w-full sm:w-auto">
              Open full catalog
            </Link>
          </>
        }
      />
    </section>
  );
}
