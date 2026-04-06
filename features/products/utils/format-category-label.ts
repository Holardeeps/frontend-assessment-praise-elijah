// This keeps category text presentation consistent anywhere the UI needs to
// turn a catalog slug like "home-decoration" into a readable label.
export function formatCategoryLabel(category: string) {
  return category
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}
