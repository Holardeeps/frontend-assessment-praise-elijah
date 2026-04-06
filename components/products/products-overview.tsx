type ProductsOverviewProps = {
  totalResults: string;
  currentPageLabel: string;
  averageRating: string;
  categoryCount: string;
  querySummary: string;
};

export function ProductsOverview({
  totalResults,
  currentPageLabel,
  averageRating,
  categoryCount,
  querySummary,
}: ProductsOverviewProps) {
  return (
    <section id="overview" className="scroll-mt-36 animate-reveal max-w-5xl">
      <span className="eyebrow">Catalog explorer</span>

      <div className="mt-6">
        <h1 className="max-w-4xl text-balance">
          Explore products with clear pricing, availability, and category
          context.
        </h1>
        <p className="mt-5 max-w-3xl text-base/8 text-copy-soft sm:text-lg/8">
          TradeLens brings the catalog into one focused workspace, helping our
          client&apos;s discover products faster, understand availability at a
          glance, and move through the collection with confidence.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <a href="#results" className="button-primary">
          View results
        </a>
        <a href="#categories" className="button-secondary">
          Browse categories
        </a>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
          <p className="metric-kicker">Products</p>
          <h2 className="metric-value mt-3 wrap-break-word">{totalResults}</h2>
        </article>

        <article className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
          <p className="metric-kicker">Page</p>
          <h2 className="metric-value mt-3 wrap-break-word">
            {currentPageLabel}
          </h2>
        </article>

        <article className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
          <p className="metric-kicker">Avg rating</p>
          <h2 className="metric-value mt-3 wrap-break-word">{averageRating}</h2>
        </article>

        <article className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
          <p className="metric-kicker">Categories</p>
          <h2 className="metric-value mt-3 wrap-break-word">{categoryCount}</h2>
        </article>
      </div>

      <div className="mt-6 rounded-panel-md border border-line-soft bg-panel px-4 py-4">
        <p className="metric-kicker">View summary</p>
        <p className="mt-3 wrap-break-word text-sm leading-6 text-ink">
          {querySummary}
        </p>
      </div>
    </section>
  );
}
