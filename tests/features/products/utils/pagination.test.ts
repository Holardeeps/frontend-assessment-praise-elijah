import {
  buildPaginationMeta,
  clampPageToTotal,
  getPaginationOffset,
  getTotalPages,
} from "@/features/products/utils/pagination";

describe("pagination helpers", () => {
  it("calculates total pages and offsets from the shared page size", () => {
    // This is the core math the API layer depends on when it builds paginated requests.
    expect(getTotalPages(60, 24)).toBe(3);
    expect(getPaginationOffset(3, 24)).toBe(48);
  });

  it("clamps pages into the valid range", () => {
    // This protects the route when someone asks for an invalid page directly in the URL.
    expect(clampPageToTotal(0, 5)).toBe(1);
    expect(clampPageToTotal(9, 3)).toBe(3);
    expect(clampPageToTotal(4, 0)).toBe(1);
  });

  it("builds a full pagination snapshot for non-empty results", () => {
    // This is the shape the listing route uses later to keep result slices and UI state aligned.
    expect(
      buildPaginationMeta({
        currentPage: 3,
        totalItems: 61,
        perPage: 24,
      }),
    ).toEqual({
      currentPage: 3,
      totalItems: 61,
      perPage: 24,
      totalPages: 3,
      offset: 48,
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });

  it("returns an empty-state pagination snapshot when there are no results", () => {
    // Empty result sets still need stable pagination metadata so the page can
    // render cleanly without pretending there are pages to navigate.
    expect(
      buildPaginationMeta({
        currentPage: 5,
        totalItems: 0,
        perPage: 24,
      }),
    ).toEqual({
      currentPage: 1,
      totalItems: 0,
      perPage: 24,
      totalPages: 0,
      offset: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });
});
