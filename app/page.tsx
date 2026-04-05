import { NavBar } from "@/components/shared/nav-bar";

// These nav items make the first screen feel like a real product website
// instead of a standalone mock section, while still pointing to simple anchors.
const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Workflow", href: "#workflow" },
  { label: "Preview", href: "#product-preview" },
];

// These feature points explain the product in business language so the hero
// reads like a product homepage, not a technical implementation note.
const heroFeatures = [
  {
    title: "Search faster",
    description: "Find products by name, category, and commercial signals in one flow.",
  },
  {
    title: "Filter clearly",
    description: "Use category, price, and sort controls without losing shareable state.",
  },
  {
    title: "Inspect deeply",
    description: "Open server-rendered product detail pages with the context teams need.",
  },
];

// This preview data gives the hero a believable product snapshot that hints at
// the final browsing experience we will build in the next phases.
const previewProducts = [
  {
    name: "Cold Chain Sentinel",
    category: "Monitoring",
    price: "$249",
    stock: "In stock",
    rating: "4.8",
  },
  {
    name: "Retail Shelf Beacon",
    category: "Operations",
    price: "$139",
    stock: "Low stock",
    rating: "4.6",
  },
];

const previewFilters = ["Monitoring", "Under $300", "Top rated"];

const previewSummary = [
  { label: "Products", value: "1,284" },
  { label: "Categories", value: "14" },
  { label: "Visible stock", value: "92%" },
];

export default function Home() {
  return (
    <main className="pb-12 sm:pb-16">
      <section>
        <div className="w-full">
          <NavBar items={navItems} />

          {/* This hero now sits directly in the page layout, while only the
          preview stays card-like because it is the actual visual object. */}
          <div
            id="overview"
            className="grid items-start gap-8 px-5 pt-10 sm:px-7 sm:pt-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)] lg:px-10 lg:gap-10"
          >
            <section className="animate-reveal">
              <span className="eyebrow">Commerce Discovery</span>

              <div className="mt-6 max-w-3xl">
                <h1 className="max-w-4xl text-balance">
                  See your product catalog the way an operations team needs it.
                </h1>
                <p className="mt-5 max-w-2xl text-base/8 text-[var(--copy-soft)] sm:text-lg/8">
                  TradeLens is a clean product explorer for browsing catalog
                  items, narrowing results quickly, and opening the detail that
                  matters without losing context.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a href="#product-preview" className="button-primary">
                  See the product view
                </a>
                <a href="#workflow" className="button-secondary">
                  Explore the workflow
                </a>
              </div>

              {/* This compact feature row keeps the hero informative without
              turning it into a wall of explanatory product bullets. */}
              <div id="workflow" className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {heroFeatures.map((feature) => (
                  <article
                    key={feature.title}
                    className="rounded-[var(--radius-md)] border border-[var(--line-soft)] bg-[var(--surface-muted)] px-4 py-4"
                  >
                    <h2 className="text-[1.05rem]">{feature.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-[var(--copy-soft)]">
                      {feature.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {/* This mock panel gives the homepage a believable product-facing
            visual anchor using the same cards and chips we can reuse later. */}
            <aside
              id="product-preview"
              className="surface-card surface-card-dark animate-reveal px-4 py-4 sm:px-5 sm:py-5 [animation-delay:120ms]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
                    Preview
                  </p>
                  <h2 className="mt-2 text-[1.45rem] text-white">
                    Filterable catalog
                  </h2>
                </div>
                <span className="rounded-full border border-white/12 bg-white/8 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/78">
                  Listing
                </span>
              </div>

              <div className="mt-5 rounded-[var(--radius-md)] border border-white/12 bg-white px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--copy-soft)]">
                  Search products
                </p>
                <p className="mt-2 text-sm text-[var(--brand-ink)]">
                  smart sensor monitor
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {previewFilters.map((filter) => (
                  <span key={filter} className="preview-chip">
                    {filter}
                  </span>
                ))}
              </div>

              <div className="mt-5 grid gap-3">
                {previewProducts.map((product) => (
                  <article
                    key={product.name}
                    className="rounded-[var(--radius-md)] border border-white/10 bg-white px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-cyan-deep)]">
                          {product.category}
                        </p>
                        <h3 className="mt-2 text-[1.15rem] text-[var(--brand-ink)]">
                          {product.name}
                        </h3>
                      </div>
                      <div className="rounded-full border border-[var(--line-soft)] bg-[var(--surface-muted)] px-3 py-2 text-sm font-semibold text-[var(--brand-ink)]">
                        {product.rating}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="pill bg-[var(--surface-muted)] px-3 py-2 text-sm">
                        {product.price}
                      </span>
                      <span className="pill bg-[var(--surface-muted)] px-3 py-2 text-sm">
                        {product.stock}
                      </span>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {previewSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[var(--radius-md)] border border-white/10 bg-white/8 px-3 py-3 text-center"
                  >
                    <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-white/60">
                      {item.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
