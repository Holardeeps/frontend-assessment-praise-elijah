import { QueryClient, type DefaultOptions } from "@tanstack/react-query";

const APP_QUERY_DEFAULT_OPTIONS: DefaultOptions = {
  queries: {
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
    refetchOnWindowFocus: false,
  },
  mutations: {
    retry: false,
  },
};

let browserQueryClient: QueryClient | undefined;

// This factory keeps TanStack Query defaults in one place so app code, tests,
// and future enhancement hooks all share the same baseline behavior.
export function createTradeLensQueryClient(
  defaultOptions?: DefaultOptions,
) {
  return new QueryClient({
    defaultOptions: {
      ...APP_QUERY_DEFAULT_OPTIONS,
      ...defaultOptions,
      queries: {
        ...APP_QUERY_DEFAULT_OPTIONS.queries,
        ...defaultOptions?.queries,
      },
      mutations: {
        ...APP_QUERY_DEFAULT_OPTIONS.mutations,
        ...defaultOptions?.mutations,
      },
    },
  });
}

// This browser singleton prevents the provider from creating a fresh cache on
// every client render once we mount TanStack Query in the app shell.
export function getTradeLensBrowserQueryClient() {
  if (!browserQueryClient) {
    browserQueryClient = createTradeLensQueryClient();
  }

  return browserQueryClient;
}
