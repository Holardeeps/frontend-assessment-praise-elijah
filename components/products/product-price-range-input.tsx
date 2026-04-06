"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { PRODUCT_FILTER_DEBOUNCE_MS } from "@/features/products/constants";
import {
  buildProductsFilterHref,
  buildProductsHref,
  normalizePriceRange,
  parsePriceFilterInput,
} from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";
import type { HTMLAttributes } from "react";

type ProductPriceRangeInputProps = {
  label: string;
  description: string;
  query: ProductQueryState;
  preview: string;
} & HTMLAttributes<HTMLElement>;

function getInitialPriceValue(value: number | null) {
  return value !== null ? String(value) : "";
}

export function ProductPriceRangeInput({
  className,
  label,
  description,
  query,
  preview,
}: ProductPriceRangeInputProps) {
  const router = useRouter();
  const lastAppliedHrefRef = useRef<string | null>(null);
  const [minPriceText, setMinPriceText] = useState(() =>
    getInitialPriceValue(query.minPrice),
  );
  const [maxPriceText, setMaxPriceText] = useState(() =>
    getInitialPriceValue(query.maxPrice),
  );
  const currentHref = buildProductsHref(query);

  // This keeps the two price fields acting like one shared filter, so the URL
  // is updated once per pause in typing instead of on every single keystroke.
  useEffect(() => {
    const normalizedRange = normalizePriceRange(
      parsePriceFilterInput(minPriceText),
      parsePriceFilterInput(maxPriceText),
    );

    if (
      normalizedRange.minPrice === query.minPrice &&
      normalizedRange.maxPrice === query.maxPrice
    ) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      const nextHref = buildProductsFilterHref(query, {
        minPrice: normalizedRange.minPrice,
        maxPrice: normalizedRange.maxPrice,
      });

      if (
        nextHref === currentHref ||
        lastAppliedHrefRef.current === nextHref
      ) {
        return;
      }

      lastAppliedHrefRef.current = nextHref;
      router.replace(nextHref, { scroll: false });
    }, PRODUCT_FILTER_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [currentHref, maxPriceText, minPriceText, query, router]);

  return (
    <article
      className={[
        "self-start rounded-panel-md border border-line-soft bg-panel-soft px-4 py-3.5",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-3 xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] xl:items-end xl:gap-4">
        <div className="min-w-0">
          <p className="metric-kicker">{label}</p>
          <p className="mt-2 text-sm font-semibold text-ink sm:text-base">{preview}</p>
          <p className="mt-2 text-sm leading-6 text-copy-soft">{description}</p>
        </div>

        <div className="grid gap-2.5 xs:grid-cols-2">
          <label className="flex flex-col gap-1 rounded-panel-sm border border-line-soft bg-panel px-3 py-2.5">
            <span className="metric-kicker">Min</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={minPriceText}
              onChange={(event) => setMinPriceText(event.target.value)}
              placeholder="0"
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-copy-soft sm:text-base"
            />
          </label>

          <label className="flex flex-col gap-1 rounded-panel-sm border border-line-soft bg-panel px-3 py-2.5">
            <span className="metric-kicker">Max</span>
            <input
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={maxPriceText}
              onChange={(event) => setMaxPriceText(event.target.value)}
              placeholder="Any"
              className="w-full bg-transparent text-sm font-semibold text-ink outline-none placeholder:text-copy-soft sm:text-base"
            />
          </label>
        </div>
      </div>
    </article>
  );
}
