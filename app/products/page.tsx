import { PRODUCTS_PER_PAGE } from "@/features/products/constants";
import {
  parseProductQuery,
  toProductSearchParams,
} from "@/features/products/utils";
import { getProductCategories, getProductList } from "@/lib/api/products";
import { NavBar } from "@/components/shared/nav-bar";

// These nav items now point at real sections on the server-rendered listing
// route so the page feels like a working product surface instead of a mock shell.
const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Results", href: "#results" },
  { label: "Categories", href: "#categories" },
];

// These small helpers keep formatting logic out of the JSX so the route stays
// readable while still showing real server-fetched data in a polished way.
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US");

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatInteger(value: number) {
  return integerFormatter.format(value);
}

function getQuerySummary(queryString: string) {
  return queryString.length > 0 ? `?${queryString}` : "Base catalog view";
}

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = await parseProductQuery(searchParams);
  const [productList, categories] = await Promise.all([
    getProductList(query),
    getProductCategories(),
  ]);
  const queryString = new URLSearchParams(
    toProductSearchParams(productList.query),
  ).toString();
  const averageRating =
    productList.products.length > 0
      ? (
          productList.products.reduce(
            (total, product) => total + product.rating,
            0,
          ) / productList.products.length
        ).toFixed(1)
      : "0.0";

  return (
    <main className="pb-12 sm:pb-16">
      <section>
        <div className="w-full">
          <NavBar
            items={navItems}
            cta={{ href: "#results", label: "View results" }}
          />

          {/* This is the first real server-rendered listing route, so the top
          section explains the live state currently driving the catalog below. */}
          <div id="overview" className="px-5 pt-10 sm:px-7 sm:pt-12 lg:px-10">
            <section className="animate-reveal max-w-4xl">
              <span className="eyebrow">Commerce Discovery</span>

              <div className="mt-6">
                <h1 className="max-w-4xl text-balance">
                  Browse a live product catalog with server-rendered results.
                </h1>
                <p className="mt-5 max-w-2xl text-base/8 text-copy-soft sm:text-lg/8">
                  TradeLens now reads the URL, parses the active query on the
                  server, and renders real product data from DummyJSON through a
                  shared API layer.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#results" className="button-primary">
                  Jump to results
                </a>
                <a href="#categories" className="button-secondary">
                  See categories
                </a>
              </div>

              {/* This summary strip makes the active dataset visible now, even
              before the dedicated filter bar and polished listing UI land later. */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <article className="rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                    Total results
                  </p>
                  <h2 className="mt-3 text-[1.9rem]">
                    {formatInteger(productList.total)}
                  </h2>
                </article>

                <article className="rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                    Current page
                  </p>
                  <h2 className="mt-3 text-[1.9rem]">
                    {productList.page}/{Math.max(productList.totalPages, 1)}
                  </h2>
                </article>

                <article className="rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                    Avg rating
                  </p>
                  <h2 className="mt-3 text-[1.9rem]">{averageRating}</h2>
                </article>

                <article className="rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                    Per page
                  </p>
                  <h2 className="mt-3 text-[1.9rem]">{PRODUCTS_PER_PAGE}</h2>
                </article>
              </div>

              <div className="mt-6 rounded-md border border-(--line-soft) bg-white px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                  Active query
                </p>
                <p className="mt-3 break-all text-sm leading-6 text-ink">
                  {getQuerySummary(queryString)}
                </p>
              </div>
            </section>
          </div>

          <div className="grid items-start gap-8 px-5 pt-8 sm:px-7 lg:grid-cols-[minmax(0,1fr)_22rem] lg:px-10 lg:gap-10">
            {/* This results block intentionally stays straightforward for now:
            real data first, then the polished product-card and filter UI later. */}
            <section
              id="results"
              className="animate-reveal [animation-delay:120ms]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                    Results
                  </p>
                  <h2 className="mt-2 text-[1.45rem]">
                    Live products from the shared API layer
                  </h2>
                </div>
                <p className="text-sm leading-6 text-copy-soft">
                  Showing {productList.products.length} products on this page
                  out of {formatInteger(productList.total)} total matches.
                </p>
              </div>

              {productList.products.length > 0 ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {productList.products.map((product) => (
                    <article
                      key={product.id}
                      className="rounded-md border border-(--line-soft) bg-white px-4 py-4 shadow-(--shadow-card)"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--brand-cyan-deep)">
                            {product.category}
                          </p>
                          <h3 className="mt-2 text-[1.15rem] text-ink">
                            {product.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-copy-soft">
                            {product.description}
                          </p>
                        </div>

                        <div className="rounded-full border border-(--line-soft) bg-panel-soft px-3 py-2 text-sm font-semibold text-ink">
                          {product.rating.toFixed(1)}
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="pill bg-panel-soft px-3 py-2 text-sm">
                          {formatCurrency(product.price)}
                        </span>
                        <span className="pill bg-panel-soft px-3 py-2 text-sm">
                          Stock {formatInteger(product.stock)}
                        </span>
                        {product.brand ? (
                          <span className="pill bg-panel-soft px-3 py-2 text-sm">
                            {product.brand}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-lg border border-dashed border-(--line-strong) bg-panel-soft px-5 py-10 text-center">
                  <h3>No products matched this query.</h3>
                  <p className="mt-3 text-sm leading-6 text-copy-soft">
                    This simple empty state confirms the server query ran
                    correctly. The dedicated empty-state design and retry flow
                    will be polished in a later phase.
                  </p>
                </div>
              )}

              <div className="mt-6 rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                  Pagination snapshot
                </p>
                <p className="mt-3 text-sm leading-6 text-ink">
                  Page {productList.page} of{" "}
                  {Math.max(productList.totalPages, 1)}.
                  {productList.hasPreviousPage
                    ? " Previous page available."
                    : " At first page."}
                  {productList.hasNextPage
                    ? " Next page available."
                    : " At last page."}
                </p>
              </div>
            </section>

            {/* This side panel proves categories and active state are already
            available on the server before we build the dedicated filter UI. */}
            <aside
              id="categories"
              className="surface-card animate-reveal px-4 py-4 sm:px-5 sm:py-5 [animation-delay:180ms]"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-copy-soft">
                  Categories
                </p>
                <h2 className="mt-2 text-[1.45rem]">Available filters</h2>
                <p className="mt-3 text-sm leading-6 text-copy-soft">
                  {formatInteger(categories.length)} categories are already
                  available for the upcoming filter bar.
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {categories.slice(0, 12).map((category) => (
                  <article
                    key={category.slug}
                    className="pill bg-panel-soft px-3 py-2 text-sm"
                  >
                    {category.name}
                  </article>
                ))}
              </div>

              <div className="mt-6 rounded-md border border-(--line-soft) bg-panel-soft px-4 py-4">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-copy-soft">
                  Current state
                </p>
                <p className="mt-3 text-sm leading-6 text-ink">
                  Search: {productList.query.search || "none"}
                </p>
                <p className="mt-1 text-sm leading-6 text-ink">
                  Category: {productList.query.category || "all"}
                </p>
                <p className="mt-1 text-sm leading-6 text-ink">
                  Sort: {productList.query.sort || "default"}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
