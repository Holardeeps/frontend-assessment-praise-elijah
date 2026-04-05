"use client";

import { useState } from "react";

type NavItem = {
  href: string;
  label: string;
};

type NavBarProps = {
  items: NavItem[];
};

export function NavBar({ items }: NavBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // This keeps menu interactions predictable on mobile by letting every link
  // close the panel after navigation instead of leaving it open.
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="animate-reveal px-5 pt-4 sm:px-7 sm:pt-5 lg:px-10 lg:pt-6">
      <div className="rounded-[calc(var(--radius-lg)+0.25rem)] border border-[var(--line-soft)] bg-white px-4 py-3 shadow-[0_10px_26px_rgba(2,2,51,0.05)] sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <a href="#overview" className="flex min-w-0 items-center gap-3">
            <span className="brand-mark" aria-hidden>
              TL
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-[var(--brand-ink)]">
                TradeLens
              </p>
              <p className="truncate text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--copy-soft)]">
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

            <a href="#product-preview" className="button-primary">
              View preview
            </a>
          </div>

          {/* This hamburger gives small screens a clean top bar while the full
          menu opens below as a focused vertical panel. */}
          <button
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-soft)] bg-[var(--surface-base)] text-[var(--brand-ink)] transition-colors duration-150 ease-[var(--ease-standard)] hover:border-[var(--line-strong)] md:hidden"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-[var(--ease-standard)] ${
                  isMenuOpen ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-[2px] w-5 rounded-full bg-current transition-opacity duration-150 ease-[var(--ease-standard)] ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 top-[14px] block h-[2px] w-5 rounded-full bg-current transition-transform duration-200 ease-[var(--ease-standard)] ${
                  isMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {/* This expanding mobile panel keeps the menu tucked away until needed,
        while still giving the small-screen experience a polished navigation flow. */}
        <div
          id="mobile-navigation"
          className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-[var(--ease-standard)] md:hidden ${
            isMenuOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <nav
              aria-label="Mobile primary"
              className="flex flex-col gap-2 border-t border-[var(--line-soft)] pt-4"
            >
              {items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-[var(--radius-sm)] px-3 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--brand-ink)] transition-colors duration-150 ease-[var(--ease-standard)] hover:bg-[var(--surface-muted)]"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#product-preview"
                className="button-primary mt-2 w-full"
                onClick={closeMenu}
              >
                View preview
              </a>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
