import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// This clears the rendered DOM after every test so each spec starts from the
// same clean state and does not leak UI between test cases.
afterEach(() => {
  cleanup();
});

// jsdom does not implement pointer capture or scrollIntoView, both of which
// Radix UI primitives call into. Stubbing them here keeps the Radix-driven
// Select and Dialog flows usable from inside the test suite.
if (typeof Element !== "undefined") {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => {};
  }
  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => {};
  }
  if (!Element.prototype.scrollIntoView) {
    Element.prototype.scrollIntoView = () => {};
  }
}
