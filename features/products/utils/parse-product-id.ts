// This keeps product-id parsing consistent anywhere we accept a dynamic
// product route param, so pages and internal API routes reject bad ids the
// same way.
export function parseProductId(value: string) {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
}
