import { DEFAULT_PRODUCT_QUERY_STATE } from "@/features/products/constants";
import {
  parseProductQuery,
  toProductSearchParams,
} from "@/features/products/utils/parse-product-query";

describe("parseProductQuery", () => {
  it("normalizes a mixed query into the typed listing state", async () => {
    // This case teaches the main happy path: trim text, lowercase categories,
    // fix reversed price bounds, and preserve supported sort/page values.
    await expect(
      parseProductQuery(
        Promise.resolve({
          search: "  smart   watch  ",
          category: "SmartPhones",
          minPrice: "500",
          maxPrice: "100",
          sort: "price-desc",
          page: "3",
          ignored: "keep out",
        }),
      ),
    ).resolves.toEqual({
      search: "smart watch",
      category: "smartphones",
      minPrice: 100,
      maxPrice: 500,
      sort: "price-desc",
      page: 3,
    });
  });

  it("falls back to defaults when values are empty or invalid", async () => {
    // This case covers the protective behavior that keeps URL tampering or
    // malformed links from leaking bad values into the rest of the app.
    await expect(
      parseProductQuery({
        search: "   ",
        category: "",
        minPrice: "-20",
        maxPrice: "not-a-number",
        sort: "oldest-first",
        page: "2abc",
      }),
    ).resolves.toEqual(DEFAULT_PRODUCT_QUERY_STATE);
  });

  it("uses the first meaningful value when repeated params are present", async () => {
    // Next can surface repeated query params as arrays, so the parser should
    // consistently choose the first useful value instead of crashing or guessing.
    await expect(
      parseProductQuery({
        search: ["", "tablet", "phone"],
        category: ["", "laptops"],
        page: ["", "4"],
      }),
    ).resolves.toEqual({
      ...DEFAULT_PRODUCT_QUERY_STATE,
      search: "tablet",
      category: "laptops",
      page: 4,
    });
  });
});

describe("toProductSearchParams", () => {
  it("serializes only active query values back into URL params", () => {
    // This keeps future filter links clean by omitting nulls and the default page.
    expect(
      toProductSearchParams({
        search: "tablet",
        category: "laptops",
        minPrice: 50,
        maxPrice: null,
        sort: "rating-desc",
        page: 1,
      }),
    ).toEqual({
      search: "tablet",
      category: "laptops",
      minPrice: "50",
      sort: "rating-desc",
    });
  });
});
