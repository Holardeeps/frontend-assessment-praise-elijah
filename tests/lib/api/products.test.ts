import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchProductsApi } from "@/lib/api/products";

describe("fetchProductsApi", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the last successful response when a later retryable request times out", async () => {
    const fetchMock = vi.mocked(fetch);
    const cachedPayload = {
      products: [
        {
          id: 1,
          title: "Cached response",
        },
      ],
    };
    const timeoutError = new Error("The product service timed out.");

    timeoutError.name = "TimeoutError";

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => cachedPayload,
    } as Response);

    await expect(
      fetchProductsApi("/products/test-cache", {
        searchParams: { q: "cached" },
        retries: 0,
      }),
    ).resolves.toEqual(cachedPayload);

    fetchMock.mockRejectedValueOnce(timeoutError);

    await expect(
      fetchProductsApi("/products/test-cache", {
        searchParams: { q: "cached" },
        retries: 0,
      }),
    ).resolves.toEqual(cachedPayload);
  });
});
