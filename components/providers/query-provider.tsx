"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

import { getTradeLensBrowserQueryClient } from "@/lib/query/query-client";

type QueryProviderProps = {
  children: ReactNode;
};

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then((module) => ({
            default: module.ReactQueryDevtools,
          })),
        { ssr: false },
      )
    : null;

export function QueryProvider({ children }: QueryProviderProps) {
  // This keeps one stable client cache alive for the mounted app session while
  // still letting the browser-side query client live outside route components.
  const [queryClient] = useState(() => getTradeLensBrowserQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* These devtools stay out of production bundles and only load when
          we're actively debugging client-side cache behavior in development. */}
      {ReactQueryDevtools ? (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      ) : null}
    </QueryClientProvider>
  );
}
