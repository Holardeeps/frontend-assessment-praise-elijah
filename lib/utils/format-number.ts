const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const integerFormatter = new Intl.NumberFormat("en-US");

// This keeps product pricing consistent anywhere we need to render dollars in
// the UI, rather than creating new Intl formatters inside components.
export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

// This centralizes whole-number formatting for counts like stock totals,
// result counts, and category totals across the listing UI.
export function formatInteger(value: number) {
  return integerFormatter.format(value);
}
