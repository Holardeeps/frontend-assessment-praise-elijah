"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { useUiStore } from "@/store/use-ui-store";

type ProductFiltersPanelProps = {
  activeFilterCount: number;
  children: ReactNode;
};

export function ProductFiltersPanel({
  activeFilterCount,
  children,
}: ProductFiltersPanelProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const isFilterDrawerOpen = useUiStore((state) => state.isFilterDrawerOpen);
  const openFilterDrawer = useUiStore((state) => state.openFilterDrawer);
  const closeFilterDrawer = useUiStore((state) => state.closeFilterDrawer);

  // Close the drawer whenever the route or query string changes so the
  // refreshed results land directly on the listing once a filter is applied.
  useEffect(() => {
    closeFilterDrawer();
  }, [closeFilterDrawer, pathname, searchParamsKey]);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      openFilterDrawer();
    } else {
      closeFilterDrawer();
    }
  };

  return (
    <Dialog.Root open={isFilterDrawerOpen} onOpenChange={handleOpenChange}>
      <div className="mt-5 flex flex-col gap-3">
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="button-secondary w-full"
            aria-label={
              activeFilterCount > 0
                ? `Open filters panel, ${activeFilterCount} filters active`
                : "Open filters panel"
            }
          >
            Refine results
          </button>
        </Dialog.Trigger>

        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-sm leading-6 text-copy-soft"
        >
          {activeFilterCount > 0
            ? `${activeFilterCount} filters are active in this view.`
            : "Open the filter drawer to narrow this catalog view."}
        </p>
      </div>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-navy/18 backdrop-blur-[1px]" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 top-0 z-50 px-[var(--page-gutter)] pt-24 pb-6 outline-none">
          <div className="mx-auto h-full w-full overflow-y-auto rounded-panel-lg border border-line-soft bg-panel px-4 py-4 shadow-panel-floating sm:px-5 sm:py-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="metric-kicker">Refine results</p>
                <Dialog.Title className="sr-only">Refine results</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm leading-6 text-copy-soft">
                  Adjust the catalog filters, then close this panel to review
                  the refreshed results.
                </Dialog.Description>
              </div>

              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label="Close filters panel"
                  className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line-soft bg-panel text-sm font-semibold text-ink transition-colors duration-150 ease-fluid hover:border-line-strong hover:bg-panel-soft"
                >
                  Close
                </button>
              </Dialog.Close>
            </div>

            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
