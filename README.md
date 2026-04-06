# TradeLens

TradeLens is a product catalog explorer built with Next.js, TypeScript, Tailwind CSS, and Cloudflare/OpenNext. It is currently in active build for a frontend assessment and is not live yet.

## Current Status

- `/` redirects to `/products`
- `/products` is server-rendered and fetches live product data
- `/products/[id]` now has a working detail route foundation
- product detail pages now include dynamic metadata and breadcrumb navigation
- related products now stream into the detail page behind a Suspense fallback
- related products now hydrate into TanStack Query so repeat detail views can reuse that client cache
- an internal products JSON route now exists for client-side catalog enhancements
- an internal related-products JSON route now exists for client-side enhancements
- the pagination next button now warms the next catalog page through TanStack Query on hover or focus
- the catalog results page now supports a persisted grid / compact view mode
- recent searches are now saved locally and can be reused from the filter bar
- Cloudflare static asset headers now mark `/_next/static/*` as immutable for one year
- the Cloudflare runtime now includes a durable revalidation queue for time-based cache refreshes
- URL query state already supports search, category, price, sort, and page parsing
- catalog cards now include live product imagery with graceful fallback
- numbered pagination plus previous / next navigation is working
- loading, error, and empty states are now in place for `/products`
- the main catalog and detail flows have now had an accessibility-focused pass
- Vitest + React Testing Library are set up and running

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

For a Cloudflare-style local preview:

```bash
npm run preview
```

Open `http://localhost:8787`.

## Useful Scripts

```bash
npm run dev
npm run test -- --run
npm run lint
npm run build
npm run preview
```

## Environment

The repo includes [.env.example](/trade-lens/.env.example).

Current keys:

- `NEXT_PUBLIC_SITE_URL`
- `PRODUCTS_API_BASE_URL`

The app currently falls back to DummyJSON if `PRODUCTS_API_BASE_URL` is not set.

## Project Shape

```text
app/
components/
  products/
  shared/
features/products/
lib/
tests/
types/
```

## Accessibility QA

Current verified coverage:

- a keyboard-only skip link now jumps past the sticky nav to the main content
- `/products` and `/products/[id]` now have clearer landmark and heading structure
- filter inputs, pagination controls, view toggles, recent-search chips, and card links now expose stronger accessible names
- the mobile filter drawer traps focus correctly, closes on `Escape`, and returns focus to its trigger
- the mobile nav and custom select menus now have stronger keyboard and focus behavior
- results and filter summaries now use polite live status messaging where appropriate
- reduced-motion handling and helper-text contrast were tightened during the accessibility pass

Current automated verification:

- `10` Vitest files
- `22` passing tests
- focused regression coverage now includes drawer focus behavior, dropdown keyboard navigation, and mobile-nav focus return

Still best checked manually in the browser:

- a full keyboard sweep on `/products` and `/products/[id]`
- a quick Lighthouse accessibility pass
- a final screen-reader spot check for the filter drawer, custom dropdown, and pagination announcements

## Cache Strategy

- Product listing data uses `cache: "force-cache"` with `next.revalidate = 180` so the catalog stays reasonably fresh without making every request fully dynamic.
- Product detail data uses the same `180` second revalidation window, which keeps detail pages responsive while still allowing pricing and stock changes to refresh on a short cadence.
- Product categories use a longer `3600` second revalidation window because that taxonomy changes less often than pricing or availability.
- Internal JSON enhancement routes for `/api/products` and `/api/products/[id]/related` also use `revalidate = 180` so TanStack Query prefetches stay aligned with the server-rendered catalog and detail views.
- Immutable build assets under `/_next/static/*` are marked with `Cache-Control: public,max-age=31536000,immutable` through [public/\_headers](/home/praise/Desktop/WORK/trade-lens/public/_headers), matching Cloudflare/OpenNext guidance for static assets.
- OpenNext is configured with an R2-backed incremental cache and a durable revalidation queue, so time-based cache refreshes are coordinated in the Cloudflare runtime instead of relying on request-by-request origin work alone.

## Cache Trade-Offs

- I kept the listing and detail routes on short revalidation windows instead of forcing them fully static because filters, availability, and catalog detail pages should stay meaningfully fresh.
- I did not add a custom `x-cache-status` response header yet. In the current OpenNext Cloudflare setup, exposing that safely would require worker-level response instrumentation, and I did not want to trade runtime stability for a bonus-only verification signal.
- Categories are cached longer because they are structurally stable, while listing and detail data are treated as operational content that changes more frequently.

## Notes

- The product data depends on an external API, so occasional upstream slowdowns can still happen during development.
- The `/products` route now fails more gracefully with retries, timeouts, a short stale-response fallback for transient upstream errors, and product-facing fallback states.
- Deployment and final assessment notes will be added once the app is feature-complete.
