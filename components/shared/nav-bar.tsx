"use client";

import { useState } from "react";

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

  // This keeps menu interactions predictable on mobile by letting every link
  // close the panel after navigation instead of leaving it open.
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 animate-reveal bg-panel/95 pt-4 pb-3 backdrop-blur-sm sm:pt-5">
      <div className="content-shell">
        <div className="rounded-nav-shell border border-line-soft bg-panel px-4 py-3 shadow-panel sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <a href="#overview" className="flex min-w-0 items-center gap-3">
              <span className="brand-mark" aria-hidden>
                TL
              </span>
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-ink">
                  TradeLens
                </p>
                <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-copy-soft">
                  Global product intelligence
                </p>
              </div>
            </a>

            {/* This desktop nav uses explicit flex utilities instead of relying on
            broad helper classes, which keeps it reliably horizontal on larger screens. */}
            <div className="hidden md:flex md:items-center md:gap-5 lg:gap-8">
              <nav aria-label="Primary" className="flex items-center gap-5 lg:gap-7">
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
              type="button"
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-soft bg-panel text-ink transition-colors duration-150 ease-fluid hover:border-line-strong md:hidden"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-fluid ${
                    isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-opacity duration-150 ease-fluid ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-fluid ${
                    isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>

          {/* This expanding mobile panel stays in the normal document flow, so
          opening it increases the header height and pushes the page content down. */}
          <div
            id="mobile-navigation"
            className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-fluid md:hidden ${
              isMenuOpen
                ? "mt-4 grid-rows-[1fr] opacity-100"
                : "mt-0 grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <nav
                aria-label="Mobile primary"
                className="flex flex-col gap-2 border-t border-line-soft pt-4"
              >
                {items.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="rounded-panel-sm px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-ink transition-colors duration-150 ease-fluid hover:bg-panel-soft"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </a>
                ))}

                <a
                  href={cta.href}
                  className="button-primary mt-2 w-full"
                  onClick={closeMenu}
                >
                  {cta.label}
                </a>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
