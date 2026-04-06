"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useState } from "react";

import { getTradeLensBrowserQueryClient } from "@/lib/query/query-client";

type QueryProviderProps = {
  children: ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  // This keeps one stable client cache alive for the mounted app session while
  // still letting the browser-side query client live outside route components.
  const [queryClient] = useState(() => getTradeLensBrowserQueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
