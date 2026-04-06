"use client";

import { useEffect, useRef, useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type NavBarProps = {
  items: NavItem[];
  cta?: {
    href: string;
    label: string;
  };
};

const defaultCta = {
  href: "#results",
  label: "View results",
};

export function NavBar({ items, cta = defaultCta }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const shouldRestoreFocusRef = useRef(false);

  // This keeps menu interactions predictable on mobile by letting every link close the panel after navigation instead of leaving it open.
  const closeMenu = (restoreFocus = false) => {
    shouldRestoreFocusRef.current = restoreFocus;
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      return;
    }

    if (!isMenuMounted) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsMenuMounted(false);
    }, 220);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMenuMounted, isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      const firstLink = mobileNavRef.current?.querySelector<HTMLElement>("a[href]");
      firstLink?.focus();
      return;
    }

    if (!shouldRestoreFocusRef.current) {
      return;
    }

    toggleButtonRef.current?.focus();
    shouldRestoreFocusRef.current = false;
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    if (isMenuOpen) {
      closeMenu(true);
      return;
    }

    setIsMenuMounted(true);
    setIsMenuOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 animate-reveal bg-panel/95 pt-4 pb-3 backdrop-blur-sm sm:pt-5">
      <div className="page-gutter">
        <div className="relative rounded-nav-shell border border-line-soft bg-panel px-4 py-3 shadow-panel sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <a href="#overview" className="flex min-w-0 items-center gap-3">
              <span className="brand-mark" aria-hidden>
                TL
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-ink">
                  TradeLens
                </p>
                <p className="nav-kicker truncate">
                  Global product intelligence
                </p>
              </div>
            </a>

            {/* This desktop nav uses explicit flex utilities instead of relying on
            broad helper classes, which keeps it reliably horizontal on larger screens. */}
            <div className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8">
              <nav
                aria-label="Primary"
                className="flex items-center gap-5 lg:gap-7"
              >
                {items.map((item) => (
                  <a key={item.href} href={item.href} className="site-nav-link">
                    {item.label}
                  </a>
                ))}
              </nav>

              <a href={cta.href} className="button-primary">
                {cta.label}
              </a>
            </div>

            {/* This hamburger gives small screens a clean top bar while the full
            menu opens below as a focused vertical panel. */}
            <button
              ref={toggleButtonRef}
              type="button"
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-soft bg-panel text-ink transition-colors duration-150 ease-fluid hover:border-line-strong lg:hidden"
              onClick={toggleMenu}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`hamburger-line hamburger-line-top ${
                    isMenuOpen ? "hamburger-line-top-open" : ""
                  }`}
                />
                <span
                  className={`hamburger-line hamburger-line-middle ${
                    isMenuOpen ? "hamburger-line-middle-open" : ""
                  }`}
                />
                <span
                  className={`hamburger-line hamburger-line-bottom ${
                    isMenuOpen ? "hamburger-line-bottom-open" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          {isMenuMounted ? (
            <div
              id="mobile-navigation"
              aria-hidden={!isMenuOpen}
              className={`mobile-nav-panel lg:hidden ${
                isMenuOpen ? "mobile-nav-panel-open" : "mobile-nav-panel-closed"
              }`}
            >
            <nav
              ref={mobileNavRef}
              aria-label="Mobile primary"
              className="flex flex-col items-center gap-2 border-t border-line-soft pt-4 text-center"
            >
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="w-full rounded-panel-sm px-3 py-3 text-center text-sm font-semibold uppercase tracking-wide text-ink transition-colors duration-150 ease-fluid hover:bg-panel-soft"
                  onClick={() => closeMenu(false)}
                >
                  {item.label}
                  </a>
                ))}

                <a
                  href={cta.href}
                  className="button-primary mt-2 w-full"
                  onClick={() => closeMenu(false)}
                >
                  {cta.label}
                </a>
              </nav>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
