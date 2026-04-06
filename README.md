# TradeLens

TradeLens is a product catalog explorer built with Next.js, TypeScript, Tailwind CSS, and Cloudflare/OpenNext. It is currently in active build for a frontend assessment and is not live yet.

## Current Status

- `/` redirects to `/products`
- `/products` is server-rendered and fetches live product data
- `/products/[id]` now has a working detail route foundation
- product detail pages now include dynamic metadata and breadcrumb navigation
- related products now stream into the detail page behind a Suspense fallback
- the catalog results page now supports a persisted grid / compact view mode
- recent searches are now saved locally and can be reused from the filter bar
- URL query state already supports search, category, price, sort, and page parsing
- catalog cards now include live product imagery with graceful fallback
- numbered pagination plus previous / next navigation is working
- loading, error, and empty states are now in place for `/products`
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

The repo includes [.env.example](/home/praise/Desktop/WORK/trade-lens/.env.example).

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

## Notes

- The product data depends on an external API, so occasional upstream slowdowns can still happen during development.
- The `/products` route now fails more gracefully with retries, timeouts, and product-facing fallback states.
- Deployment and final assessment notes will be added once the app is feature-complete.
