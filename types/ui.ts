export type ProductViewMode = "grid" | "compact";

export type UiStoreState = {
  isFilterDrawerOpen: boolean;
  viewMode: ProductViewMode;
  recentSearches: string[];
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  toggleFilterDrawer: () => void;
  setViewMode: (viewMode: ProductViewMode) => void;
  addRecentSearch: (search: string) => void;
  clearRecentSearches: () => void;
};
