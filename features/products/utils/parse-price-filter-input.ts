// This parser keeps the price filter inputs tolerant of blank and partially
// cleared field states while still rejecting invalid or negative values.
export function parsePriceFilterInput(value: string): number | null {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return null;
  }

  const parsedNumber = Number(normalizedValue);

  if (!Number.isFinite(parsedNumber) || parsedNumber < 0) {
    return null;
  }

  return parsedNumber;
}
