# TradeLens

TradeLens is a performance-focused product catalog explorer built with Next.js
App Router, TypeScript, Tailwind CSS, and Cloudflare/OpenNext. It uses the
DummyJSON products API as a mock catalog source and is structured to feel like
a lightweight commerce discovery surface: fast listing pages, shareable filter
state, server-rendered detail pages, and resilient handling of upstream
slowdowns.

Live URL: https://trade-lens.holardeeps.workers.dev
Repository URL: https://github.com/Holardeeps/frontend-assessment-praise-elijah

## What It Includes

- `/products` server-rendered listing page with `24` items per page
- responsive card grid with image, title, brand, price, stock, and rating
- URL-driven search, category, price, sort, and pagination state
- `/products/[id]` dynamic detail route with metadata and breadcrumb navigation
- streamed related products with Suspense
- loading, error, unavailable, and empty states
- persisted UI-only state for compact/grid view, recent searches, and mobile
  filter drawer behavior

## Run Locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

```bash
npm run lint
npx tsc --noEmit
npm run test -- --run
npm run build
npm run start
npm run preview
```

## Environment

The repo includes [.env.example](./.env.example).

Required variable:

- `NEXT_PUBLIC_SITE_URL`

Notes:

- no API key is required
- no separate backend service is required
- the app uses DummyJSON directly for this assessment, so no extra API base URL
  configuration is needed

## Architecture Decisions

- Server Components are the default for catalog and detail pages so the main
  data-heavy surfaces stay mostly server-rendered.
- URL state is the source of truth for listing state. Search, category, price,
  sort, and page all resolve from the URL rather than being duplicated in a
  global client store.
- Pagination was chosen over infinite scroll because it is more cacheable,
  easier to share, and easier to verify deterministically during QA.
- Zustand is limited to UI-only state: mobile filter drawer, persisted view
  mode, and recent searches.
- TanStack Query is used only for enhancement paths, not as the primary data
  source for the catalog. It powers related-products cache hydration and
  next-page prefetching.
- All external data access is centralized in [lib/api/products.ts](./lib/api/products.ts)
  so components do not call `fetch()` directly.

## Performance Optimizations

The app applies more than the minimum required optimization set:

- `next/font` is used in [app/layout.tsx](./app/layout.tsx) for font loading.
- `next/image` is used for product imagery with explicit sizing, while local
  preview can optionally bypass noisy DummyJSON optimization behavior through
  `BYPASS_REMOTE_IMAGE_OPTIMIZATION`.
- listing and detail data use explicit fetch cache policy in
  [lib/api/products.ts](./lib/api/products.ts):
  - listing/detail: `cache: "force-cache"` with `revalidate = 180`
  - categories: `cache: "force-cache"` with `revalidate = 3600`
- immutable static assets under `/_next/static/*` are given long-lived cache
  headers in [public/\_headers](./public/_headers)
- related products stream behind Suspense so the main detail view is not blocked
- eager route prefetching was reduced on large link sets, while next-page
  pagination prefetch remains intent-based on hover/focus
- upstream data fetches use retries, explicit timeouts, and stale-on-error
  fallback to reduce the impact of transient API failures

## Testing and QA

Automated checks used:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test -- --run`

Current automated test state:

- `11` Vitest files
- `23` passing tests

Covered areas include:

- product card rendering
- query parsing and pagination behavior
- filter debounce and URL updates
- mobile filter drawer focus behavior
- mobile nav keyboard dismissal and focus return
- TanStack Query provider and enhancement hooks
- stale-on-error behavior in the API layer

Lighthouse results from a local production build (`npm run build && npm run start`):

- `/products`: Performance `96`, Accessibility `100`, Best Practices `100`, SEO `100`
- `/products/[id]` tested with `/products/2?from=%2Fproducts%23results`:
  Performance `98`, Accessibility `100`, Best Practices `100`, SEO `100`

## Accessibility Notes

Accessibility work completed:

- skip link to main content
- clearer landmark and heading structure
- stronger accessible names for filters, pagination, toggles, chips, and cards
- keyboard-safe mobile drawer and custom select behavior
- polite live-region updates for results and filter summaries
- reduced-motion and contrast cleanup

Current local Lighthouse accessibility score:

- `/products`: `100`
- tested detail page: `100`

## Bonus Tasks Attempted

### B-1 Cloudflare Workers caching

- OpenNext Cloudflare adapter configured with R2 incremental cache and durable
  revalidation queue
- immutable static asset caching added through `public/_headers`
- attempted a small worker-level cache-status mirror in
  [worker.mjs](./worker.mjs) to surface listing cache behavior
- deployed `/products` responses did not expose `x-cache-status` publicly, so
  that verification part remains incomplete

### B-2 React Streaming with Suspense

- related products on the detail page stream separately behind Suspense, so the
  primary product detail content renders first

### B-3 Accessibility audit

- accessibility fixes were applied across landmarks, labels, keyboard flow,
  focus handling, live regions, contrast, and reduced motion
- local Lighthouse accessibility score reached `100` on both tested pages

## Deployment Notes

Target platform:

- Cloudflare Workers via OpenNext

Key runtime files:

- [wrangler.jsonc](./wrangler.jsonc)
- [open-next.config.ts](./open-next.config.ts)
- [worker.mjs](./worker.mjs)

Required Cloudflare bindings:

- `NEXT_INC_CACHE_R2_BUCKET`
- `NEXT_CACHE_DO_QUEUE`
- `IMAGES`

There is no backend API or secret API key to deploy for this assessment.

## Trade-Offs and Known Limitations

- The app depends on a mock external API, so transient DummyJSON slowdowns can
  still happen.
- Listing and detail routes use short revalidation windows instead of full
  static generation because catalog freshness matters more here than a purely
  static build.
- Lighthouse numbers documented here were collected from a local production
  build rather than the live deployed URL.
- Some client interactivity remains where it materially improves usability, but
  the core catalog rendering path stays server-first to avoid unnecessary
  hydration.

## Project Shape

```text
app/
components/
  products/
  shared/
features/products/
lib/
store/
tests/
types/
```

## If I Had Another 2 Hours

- add a lightweight product comparison tray so users can pin up to three items
  and compare price, rating, stock, and warranty side by side
- add a “recently viewed” strip across the catalog and detail flow so product
  discovery feels more continuous and less one-page-at-a-time
- add a compact category intelligence panel that surfaces signals from the
  current result set, like strongest-rated category or best-value category

## Notes

- [docs/testing-issues.md](./docs/testing-issues.md) tracks real issues found
  during browser and local testing
- Lighthouse screenshots are stored in
  [docs/lighthouse-proof](./docs/lighthouse-proof)
