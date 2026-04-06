# Testing Issues

Compact record of issues found during browser or local test checks, plus the
fix applied. Update this file whenever a real testing issue is found.

## Current Notes

- Responsive pagination layout:
  On mobile and small tablet widths, the pagination actions could wrap into an
  awkward layout where the next button dropped out of alignment and the page
  pills felt cramped.
  Fix: rebuilt the controls as a responsive grid with icon-only edge actions on
  narrow mobile, full text controls from the wider breakpoint, and a smoother
  hash-based results scroll after page changes.

- Large-screen filter layout:
  Above wide laptop and desktop widths, the `Refine results` section left an
  awkward blank area because the price card made the whole grid row taller than
  the other controls.
  Fix: moved price range into a responsive full-width row and made its internal
  layout more compact on larger screens.

- External product API timeouts:
  DummyJSON occasionally timed out and broke the `/products` page with a raw
  runtime error.
  Fix: added fetch retries, explicit per-request timeouts, time-based
  revalidation, and a friendly service unavailable state for listing failures.

- Product image optimization timeouts:
  Next.js could still log raw `fetch failed` errors after `/products` finished
  rendering because the image optimizer was proxying DummyJSON-hosted product
  images through the server.
  Fix: bypassed Next image optimization for `dummyjson.com` and
  `*.dummyjson.com` product images so the browser requests them directly while
  the existing UI fallback still handles broken images.

- Filter rerender loop:
  The price filter could keep triggering route replacement even when the
  normalized server query was already current.
  Fix: compare normalized client values against the current query before
  calling `router.replace()`.

- Duplicate filter navigations:
  The search and price controls could apply the same href more than once in
  development, which led to duplicate `/products` requests and made upstream
  timeout noise appear worse than the real user-facing behavior.
  Fix: added current-href and last-applied-href guards before calling
  `router.replace()`, and aligned the select control with the full current
  products href instead of only `/products`.

- Dropdown menu rendering:
  The custom select options briefly rendered into the page flow instead of
  behaving like a proper overlay dropdown.
  Fix: replaced the brittle CSS-dependent approach with a mounted utility-based
  overlay menu.

- Mobile navigation overlay:
  The mobile menu visually behaved like part of the page and at one point
  pushed content down.
  Fix: anchored it as an absolute overlay matched to the navbar shell.

- Debounce test harness:
  The filter debounce test initially timed out under fake timers.
  Fix: made the debounce assertion deterministic by using direct input change
  events and direct post-timer assertions.

- Compact catalog layout:
  The compact results mode squeezed the metrics into the image column, which
  made the stat cards wrap awkwardly and feel cramped.
  Fix: switched compact mode to an explicit grid-area layout so image, copy,
  chips, and metrics each keep the space they need.

- Filter context layout:
  On screens above mobile, the recent-search panel and current-view panel were
  stacking vertically, which made the filter section feel longer and less
  structured than it needed to.
  Fix: wrapped both panels in a responsive context row that places them side by
  side only when recent searches exist.

- Skip link visibility:
  The accessibility skip link appeared visibly at the top of the page even
  before it received keyboard focus.
  Fix: tightened the skip-link CSS so it stays visually hidden until
  `:focus-visible`, while still remaining available to keyboard users.
