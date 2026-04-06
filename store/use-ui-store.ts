import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductViewMode, UiStoreState } from "@/types/ui";

const DEFAULT_VIEW_MODE: ProductViewMode = "grid";
const MAX_RECENT_SEARCHES = 6;

// This UI store keeps lightweight interface preferences together without
// duplicating any server data that already belongs to the URL or API layer.
export const useUiStore = create<UiStoreState>()(
  persist(
    (set) => ({
      isFilterDrawerOpen: false,
      viewMode: DEFAULT_VIEW_MODE,
      recentSearches: [],
      openFilterDrawer: () => {
        set({ isFilterDrawerOpen: true });
      },
      closeFilterDrawer: () => {
        set({ isFilterDrawerOpen: false });
      },
      toggleFilterDrawer: () => {
        set((state) => ({
          isFilterDrawerOpen: !state.isFilterDrawerOpen,
        }));
      },
      setViewMode: (viewMode) => {
        set({ viewMode });
      },
      addRecentSearch: (search) => {
        const normalizedSearch = search.trim().toLowerCase();

        if (!normalizedSearch) {
          return;
        }

        set((state) => {
          const nextRecentSearches = [
            normalizedSearch,
            ...state.recentSearches.filter(
              (recentSearch) => recentSearch !== normalizedSearch,
            ),
          ].slice(0, MAX_RECENT_SEARCHES);

          return {
            recentSearches: nextRecentSearches,
          };
        });
      },
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
    }),
    {
      name: "trade-lens-ui-store",
      partialize: (state) => ({
        recentSearches: state.recentSearches,
        viewMode: state.viewMode,
      }),
    },
  ),
);
