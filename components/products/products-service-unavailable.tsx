import Link from "next/link";

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
      <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-8 shadow-panel sm:px-6">
        <p className="section-kicker">Results</p>
        <h2 className="section-title mt-2">The catalog is taking longer than expected</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-copy-soft">
          The product service did not respond in time. Try this view again, or
          return to the full catalog and retry from a simpler starting point.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href={retryHref} className="button-primary w-full sm:w-auto">
            Try again
          </Link>
          <Link href={resetHref} className="button-secondary w-full sm:w-auto">
            Open full catalog
          </Link>
        </div>
      </div>
    </section>
  );
}
