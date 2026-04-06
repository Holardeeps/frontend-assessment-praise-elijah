import { describe, expect, it } from "vitest";

import { shouldBypassNextImageOptimization } from "@/lib/utils/should-bypass-next-image-optimization";

describe("shouldBypassNextImageOptimization", () => {
  it("returns true for the DummyJSON image endpoint", () => {
    expect(
      shouldBypassNextImageOptimization("https://dummyjson.com/image/400x300"),
    ).toBe(true);
  });

  it("returns true for DummyJSON CDN product images", () => {
    expect(
      shouldBypassNextImageOptimization(
        "https://cdn.dummyjson.com/products/images/beauty/Example/thumbnail.png",
      ),
    ).toBe(true);
  });

  it("returns false for non-DummyJSON hosts or invalid values", () => {
    expect(
      shouldBypassNextImageOptimization("https://images.example.com/catalog-item.png"),
    ).toBe(false);
    expect(shouldBypassNextImageOptimization("")).toBe(false);
    expect(shouldBypassNextImageOptimization("not-a-url")).toBe(false);
  });
});
