"use client";

import { useCallback, useEffect, useId, useRef, type ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { getFocusableElements } from "@/lib/utils/get-focusable-elements";
import { useUiStore } from "@/store/use-ui-store";

type ProductFiltersPanelProps = {
  activeFilterCount: number;
  children: ReactNode;
};

export function ProductFiltersPanel({
  activeFilterCount,
  children,
}: ProductFiltersPanelProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldRestoreFocusRef = useRef(false);
  const headingId = useId();
  const descriptionId = useId();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsKey = searchParams.toString();
  const isFilterDrawerOpen = useUiStore((state) => state.isFilterDrawerOpen);
  const openFilterDrawer = useUiStore((state) => state.openFilterDrawer);
  const closeFilterDrawer = useUiStore((state) => state.closeFilterDrawer);

  const dismissDrawer = useCallback(
    (restoreFocus = true) => {
      shouldRestoreFocusRef.current = restoreFocus;
      closeFilterDrawer();
    },
    [closeFilterDrawer],
  );

  // The drawer should close itself after any route-driven filter change so the
  // refreshed results are visible immediately on small screens.
  useEffect(() => {
    shouldRestoreFocusRef.current = false;
    closeFilterDrawer();
  }, [closeFilterDrawer, pathname, searchParamsKey]);

  // Locking body scroll while the drawer is open keeps the mobile overlay
  // feeling stable and prevents the page behind it from drifting.
  useEffect(() => {
    if (!isFilterDrawerOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isFilterDrawerOpen]);

  // This makes the drawer dismissible from the keyboard on mobile devices and
  // aligns it with the same escape behavior as the select menu.
  useEffect(() => {
    if (isFilterDrawerOpen) {
      return;
    }

    if (!shouldRestoreFocusRef.current) {
      return;
    }

    triggerRef.current?.focus();
    shouldRestoreFocusRef.current = false;
  }, [isFilterDrawerOpen]);

  useEffect(() => {
    if (!isFilterDrawerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        dismissDrawer();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(panelRef.current);

      if (focusableElements.length === 0) {
        panelRef.current?.focus();
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (
          activeElement === firstElement ||
          activeElement === panelRef.current
        ) {
          lastElement.focus();
          event.preventDefault();
        }

        return;
      }

      if (activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissDrawer, isFilterDrawerOpen]);

  return (
    <div className="mt-5">
      <div className="flex flex-col gap-3 lg:hidden">
        <button
          ref={triggerRef}
          type="button"
          onClick={openFilterDrawer}
          className="button-secondary w-full"
          aria-label={
            activeFilterCount > 0
              ? `Open filters panel, ${activeFilterCount} filters active`
              : "Open filters panel"
          }
          aria-expanded={isFilterDrawerOpen}
          aria-controls="mobile-filters-panel"
        >
          Refine results
        </button>

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

      {isFilterDrawerOpen ? (
        <button
          type="button"
          aria-label="Close filters"
          onClick={() => dismissDrawer()}
          className="fixed inset-0 z-40 bg-navy/18 backdrop-blur-[1px] lg:hidden"
        />
      ) : null}

      <div
        id="mobile-filters-panel"
        ref={panelRef}
        role={isFilterDrawerOpen ? "dialog" : undefined}
        aria-modal={isFilterDrawerOpen ? "true" : undefined}
        aria-labelledby={isFilterDrawerOpen ? headingId : undefined}
        aria-describedby={isFilterDrawerOpen ? descriptionId : undefined}
        tabIndex={isFilterDrawerOpen ? -1 : undefined}
        className={[
          isFilterDrawerOpen
            ? "fixed inset-x-0 bottom-0 top-0 z-50 block px-[var(--page-gutter)] pt-24 pb-6"
            : "hidden",
          "lg:mt-0 lg:block lg:static lg:inset-auto lg:z-auto lg:px-0 lg:pt-0 lg:pb-0",
        ].join(" ")}
      >
        <div className="mx-auto h-full w-full overflow-y-auto rounded-panel-lg border border-line-soft bg-panel px-4 py-4 shadow-panel-floating sm:px-5 sm:py-5 lg:h-auto lg:max-w-none lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none">
          <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
            <div>
              <p className="metric-kicker">Refine results</p>
              <h2 id={headingId} className="sr-only">
                Refine results
              </h2>
              <p
                id={descriptionId}
                className="mt-2 text-sm leading-6 text-copy-soft"
              >
                Adjust the catalog filters, then close this panel to review the
                refreshed results.
              </p>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => dismissDrawer()}
              aria-label="Close filters panel"
              className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-line-soft bg-panel text-sm font-semibold text-ink transition-colors duration-150 ease-fluid hover:border-line-strong hover:bg-panel-soft"
            >
              Close
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
