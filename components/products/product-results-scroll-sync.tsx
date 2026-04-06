"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const RESULTS_HASH = "#results";

export function ProductResultsScrollSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    if (window.location.hash !== RESULTS_HASH) {
      return;
    }

    const resultsSection = document.getElementById("results");

    if (!resultsSection) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let firstFrameId = 0;
    let secondFrameId = 0;

    firstFrameId = window.requestAnimationFrame(() => {
      secondFrameId = window.requestAnimationFrame(() => {
        resultsSection.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrameId);
      window.cancelAnimationFrame(secondFrameId);
    };
  }, [pathname, search]);

  return null;
}
