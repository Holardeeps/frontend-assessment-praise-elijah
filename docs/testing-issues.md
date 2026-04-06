# Testing Issues

Compact record of issues found during browser or local test checks, plus the
fix applied. Update this file whenever a real testing issue is found.

## Current Notes

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

- Filter rerender loop:
  The price filter could keep triggering route replacement even when the
  normalized server query was already current.
  Fix: compare normalized client values against the current query before
  calling `router.replace()`.

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
