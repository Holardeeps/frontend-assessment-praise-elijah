// This keeps price bounds consistent anywhere they are created, so both the
// server parser and the client filter UI treat reversed ranges the same way.
export function normalizePriceRange(
  minPrice: number | null,
  maxPrice: number | null,
) {
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return {
      minPrice: maxPrice,
      maxPrice: minPrice,
    };
  }

  return {
    minPrice,
    maxPrice,
  };
}
