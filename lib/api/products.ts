import type {
  DummyJsonProductsResponse,
  ProductCategory,
  ProductCategoryList,
  ProductCategorySlug,
} from "@/types/api";
import { PRODUCT_SORT_OPTIONS, PRODUCTS_PER_PAGE } from "@/features/products/constants";
import { buildPaginationMeta, type PaginationMeta } from "@/features/products/utils";
import type { ProductQueryState, SortOption } from "@/types/filters";
import type { Product, ProductListResponse } from "@/types/product";

type ProductsApiSearchParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type ProductsApiFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

type ProductsApiRequestOptions = {
  searchParams?: ProductsApiSearchParams;
  init?: ProductsApiFetchInit;
  retries?: number;
  timeoutMs?: number;
};

type ProductListRequestOptions = {
  perPage?: number;
  init?: ProductsApiFetchInit;
};

const DEFAULT_PRODUCTS_API_BASE_URL = "https://dummyjson.com";
const DEFAULT_PRODUCTS_API_RETRIES = 2;
const DEFAULT_PRODUCTS_API_RETRY_DELAY_MS = 300;
const DEFAULT_PRODUCTS_API_TIMEOUT_MS = 5000;
const PRODUCT_LIST_REVALIDATE_SECONDS = 180;
const PRODUCT_CATEGORIES_REVALIDATE_SECONDS = 3600;

type ProductCollectionRoute = {
  pathname: string;
  searchParams?: ProductsApiSearchParams;
};

// This error shape preserves the HTTP status and URL so route-level error
// handling can produce useful messages without losing the failing request context.
export class ProductsApiError extends Error {
  status: number;
  url: string;

  constructor(message: string, options: { status: number; url: string }) {
    super(message);
    this.name = "ProductsApiError";
    this.status = options.status;
    this.url = options.url;
  }
}

function mergeProductsFetchInit(
  defaults: ProductsApiFetchInit,
  overrides?: ProductsApiFetchInit,
): ProductsApiFetchInit {
  return {
    ...defaults,
    ...overrides,
    headers: {
      ...defaults.headers,
      ...overrides?.headers,
    },
    next: {
      ...defaults.next,
      ...overrides?.next,
      tags: [...(defaults.next?.tags ?? []), ...(overrides?.next?.tags ?? [])],
    },
  };
}

function getProductsApiDefaultInit(
  kind: "list" | "categories" | "detail",
): ProductsApiFetchInit {
  switch (kind) {
    case "categories":
      return {
        next: {
          revalidate: PRODUCT_CATEGORIES_REVALIDATE_SECONDS,
          tags: ["product-categories"],
        },
      };
    case "detail":
      return {
        next: {
          revalidate: PRODUCT_LIST_REVALIDATE_SECONDS,
          tags: ["product-detail"],
        },
      };
    case "list":
    default:
      return {
        next: {
          revalidate: PRODUCT_LIST_REVALIDATE_SECONDS,
          tags: ["products"],
        },
      };
  }
}

function getProductsApiErrorCode(error: unknown): string | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const code = "code" in error ? error.code : null;
  return typeof code === "string" ? code : null;
}

function isRetryableProductsApiError(error: unknown) {
  if (error instanceof ProductsApiError) {
    return error.status >= 500 || error.status === 429;
  }

  if (error instanceof Error) {
    if (
      error.name === "TimeoutError" ||
      (error.name === "AbortError" && /timed out/i.test(error.message))
    ) {
      return true;
    }
  }

  if (!(error instanceof TypeError)) {
    return false;
  }

  const directCode = getProductsApiErrorCode(error.cause) ?? getProductsApiErrorCode(error);

  if (directCode) {
    return [
      "ETIMEDOUT",
      "ECONNRESET",
      "ECONNREFUSED",
      "ENOTFOUND",
      "UND_ERR_CONNECT_TIMEOUT",
      "UND_ERR_HEADERS_TIMEOUT",
    ].includes(directCode);
  }

  if (error.cause instanceof AggregateError) {
    return error.cause.errors.some((causeError) => {
      const causeCode = getProductsApiErrorCode(causeError);
      return causeCode
        ? [
            "ETIMEDOUT",
            "ECONNRESET",
            "ECONNREFUSED",
            "ENOTFOUND",
            "UND_ERR_CONNECT_TIMEOUT",
            "UND_ERR_HEADERS_TIMEOUT",
          ].includes(causeCode)
        : false;
    });
  }

  return true;
}

function waitForProductsApiRetry(delayMs: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function createProductsTimeoutError(timeoutMs: number) {
  const timeoutError = new Error(
    `The product service did not respond within ${timeoutMs}ms.`,
  );

  timeoutError.name = "TimeoutError";

  return timeoutError;
}

function createProductsRequestSignal(
  signal: AbortSignal | null | undefined,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const abortFromSignal = () => {
    controller.abort(signal?.reason);
  };
  const timeoutId = setTimeout(() => {
    controller.abort(createProductsTimeoutError(timeoutMs));
  }, timeoutMs);

  if (signal?.aborted) {
    abortFromSignal();
  } else if (signal) {
    signal.addEventListener("abort", abortFromSignal, { once: true });
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timeoutId);

      if (signal) {
        signal.removeEventListener("abort", abortFromSignal);
      }
    },
  };
}

// This resolves the external API base once in a predictable way: use the env
// override when present, otherwise fall back to DummyJSON's public host.
export function getProductsApiBaseUrl() {
  const configuredBaseUrl = process.env.PRODUCTS_API_BASE_URL?.trim();
  const baseUrl = configuredBaseUrl || DEFAULT_PRODUCTS_API_BASE_URL;

  return baseUrl.replace(/\/+$/, "");
}

// This builds request URLs centrally so the rest of the API module can work
// with route fragments and typed search params instead of manual string joins.
export function buildProductsApiUrl(
  pathname: string,
  searchParams: ProductsApiSearchParams = {},
) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = new URL(`${getProductsApiBaseUrl()}${normalizedPathname}`);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }

    url.searchParams.set(key, String(value));
  }

  return url;
}

// This shared fetch helper gives every future API call the same error handling
// path and leaves room for Next-specific fetch options like revalidate later on.
export async function fetchProductsApi<TResponse>(
  pathname: string,
  {
    searchParams,
    init,
    retries = DEFAULT_PRODUCTS_API_RETRIES,
    timeoutMs = DEFAULT_PRODUCTS_API_TIMEOUT_MS,
  }: ProductsApiRequestOptions = {},
): Promise<TResponse> {
  const url = buildProductsApiUrl(pathname, searchParams);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const { signal, cleanup } = createProductsRequestSignal(init?.signal, timeoutMs);

    try {
      const response = await fetch(url, {
        ...init,
        signal,
        headers: {
          Accept: "application/json",
          ...init?.headers,
        },
      });

      if (!response.ok) {
        throw new ProductsApiError("Failed to fetch products data.", {
          status: response.status,
          url: url.toString(),
        });
      }

      return (await response.json()) as TResponse;
    } catch (error) {
      const isLastAttempt = attempt === retries;

      if (isLastAttempt || !isRetryableProductsApiError(error)) {
        if (error instanceof ProductsApiError) {
          throw error;
        }

        throw new ProductsApiError(
          "The product service is temporarily unavailable.",
          {
            status: 503,
            url: url.toString(),
          },
        );
      }

      await waitForProductsApiRetry(DEFAULT_PRODUCTS_API_RETRY_DELAY_MS * (attempt + 1));
    } finally {
      cleanup();
    }
  }

  throw new ProductsApiError("The product service is temporarily unavailable.", {
    status: 503,
    url: url.toString(),
  });
}

// DummyJSON category lists can come back as either full objects or slug-only
// strings, so this formatter gives us one normalized shape for both cases.
function formatCategoryNameFromSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function normalizeProduct(product: Product): Product {
  return {
    ...product,
    brand: product.brand?.trim() || null,
    category: product.category.trim().toLowerCase(),
    tags: product.tags.map((tag) => tag.trim()).filter(Boolean),
    thumbnail: product.thumbnail.trim(),
    images: product.images.map((image) => image.trim()).filter(Boolean),
  };
}

export function normalizeProductsResponse(
  response: DummyJsonProductsResponse,
): DummyJsonProductsResponse {
  return {
    ...response,
    products: response.products.map(normalizeProduct),
  };
}

export function normalizeProductCategory(
  category: ProductCategory | ProductCategorySlug,
): ProductCategory {
  if (typeof category === "string") {
    const slug = category.trim().toLowerCase();

    return {
      slug,
      name: formatCategoryNameFromSlug(slug),
      url: `${getProductsApiBaseUrl()}/products/category/${slug}`,
    };
  }

  const slug = category.slug.trim().toLowerCase();

  return {
    slug,
    name: category.name.trim() || formatCategoryNameFromSlug(slug),
    url: category.url.trim() || `${getProductsApiBaseUrl()}/products/category/${slug}`,
  };
}

export function normalizeProductCategoryList(
  categories: ProductCategory[] | ProductCategoryList,
) {
  return categories.map(normalizeProductCategory);
}

// These small foundational reads are useful immediately for detail pages and
// filters, while the full browse/search/category listing logic lands next.
export async function getProductById(id: number, init?: ProductsApiFetchInit) {
  const product = await fetchProductsApi<Product>(`/products/${id}`, {
    init: mergeProductsFetchInit(getProductsApiDefaultInit("detail"), init),
  });

  return normalizeProduct(product);
}

export async function getProductCategories(init?: ProductsApiFetchInit) {
  const categories = await fetchProductsApi<ProductCategory[]>("/products/categories", {
    init: mergeProductsFetchInit(getProductsApiDefaultInit("categories"), init),
  });

  return normalizeProductCategoryList(categories);
}

export async function getProductCategorySlugs(init?: ProductsApiFetchInit) {
  const categories = await fetchProductsApi<ProductCategoryList>("/products/category-list", {
    init: mergeProductsFetchInit(getProductsApiDefaultInit("categories"), init),
  });

  return normalizeProductCategoryList(categories);
}

// This is the single listing entry point the products page will use next. It
// chooses the narrowest available DummyJSON route, then either paginates
// directly or falls back to server-side filtering when the API cannot express
// the full query combination by itself.
export async function getProductList(
  query: ProductQueryState,
  { perPage = PRODUCTS_PER_PAGE, init }: ProductListRequestOptions = {},
): Promise<ProductListResponse> {
  const mergedInit = mergeProductsFetchInit(getProductsApiDefaultInit("list"), init);
  const strategy = determineListStrategy(query);

  if (strategy.mode === "server-filtered") {
    return getServerFilteredProductList(query, {
      perPage,
      baseRoute: strategy.baseRoute,
      init: mergedInit,
    });
  }

  return getDirectProductList(query, {
    perPage,
    baseRoute: strategy.baseRoute,
    init: mergedInit,
  });
}

type ListStrategy =
  | {
      mode: "direct";
      baseRoute: ProductCollectionRoute;
    }
  | {
      mode: "server-filtered";
      baseRoute: ProductCollectionRoute;
    };

// The listing route can use direct API pagination for plain browse, search,
// and category views. Price filters and mixed search+category queries need a
// fetch-all fallback because DummyJSON does not expose that combination natively.
function determineListStrategy(query: ProductQueryState): ListStrategy {
  const hasSearch = query.search.length > 0;
  const hasCategory = Boolean(query.category);
  const hasPriceFilter = query.minPrice !== null || query.maxPrice !== null;

  if (hasPriceFilter || (hasSearch && hasCategory)) {
    return {
      mode: "server-filtered",
      baseRoute: buildNarrowestCollectionRoute(query, { fetchAll: true }),
    };
  }

  return {
    mode: "direct",
    baseRoute: buildNarrowestCollectionRoute(query),
  };
}

// This picks the best starting endpoint for the current query. Search is used
// as the fallback "narrow" route for mixed search+category cases because it
// usually shrinks the dataset more aggressively than a broad category list.
function buildNarrowestCollectionRoute(
  query: ProductQueryState,
  options: { fetchAll?: boolean } = {},
): ProductCollectionRoute {
  const { fetchAll = false } = options;
  const sortDefinition = getSortDefinition(query.sort);
  const baseSearchParams = {
    ...(fetchAll ? { limit: 0 } : {}),
    ...(sortDefinition
      ? { sortBy: sortDefinition.sortBy, order: sortDefinition.order }
      : {}),
  };

  if (query.search) {
    return {
      pathname: "/products/search",
      searchParams: {
        q: query.search,
        ...baseSearchParams,
      },
    };
  }

  if (query.category) {
    return {
      pathname: `/products/category/${query.category}`,
      searchParams: baseSearchParams,
    };
  }

  return {
    pathname: "/products",
    searchParams: baseSearchParams,
  };
}

// This direct path is for the cases where DummyJSON can already represent the
// requested view, so we can keep pagination work on the API instead of slicing
// arrays in memory on the server.
async function getDirectProductList(
  query: ProductQueryState,
  {
    perPage,
    baseRoute,
    init,
  }: {
    perPage: number;
    baseRoute: ProductCollectionRoute;
    init?: ProductsApiFetchInit;
  },
): Promise<ProductListResponse> {
  const initialResponse = await fetchProductCollection(baseRoute, {
    limit: perPage,
    skip: (query.page - 1) * perPage,
    init,
  });

  const initialPagination = buildPaginationMeta({
    currentPage: query.page,
    totalItems: initialResponse.total,
    perPage,
  });

  // If the requested page is out of range, we re-fetch the clamped page so the
  // returned products and pagination meta always describe the same slice.
  if (initialPagination.currentPage !== query.page) {
    const correctedResponse = await fetchProductCollection(baseRoute, {
      limit: perPage,
      skip: initialPagination.offset,
      init,
    });

    return buildProductListResponse({
      query: {
        ...query,
        page: initialPagination.currentPage,
      },
      products: correctedResponse.products,
      pagination: initialPagination,
    });
  }

  return buildProductListResponse({
    query,
    products: initialResponse.products,
    pagination: initialPagination,
  });
}

// This fallback fetches the narrowest full collection we can get from
// DummyJSON, then applies any remaining filters and sorting on the server.
async function getServerFilteredProductList(
  query: ProductQueryState,
  {
    perPage,
    baseRoute,
    init,
  }: {
    perPage: number;
    baseRoute: ProductCollectionRoute;
    init?: ProductsApiFetchInit;
  },
): Promise<ProductListResponse> {
  const fullResponse = await fetchProductCollection(baseRoute, {
    limit: 0,
    skip: 0,
    init,
  });

  const filteredProducts = applyServerSideFilters(fullResponse.products, query);
  const sortedProducts = sortProducts(filteredProducts, query.sort);
  const pagination = buildPaginationMeta({
    currentPage: query.page,
    totalItems: sortedProducts.length,
    perPage,
  });
  const pageProducts = sortedProducts.slice(
    pagination.offset,
    pagination.offset + pagination.perPage,
  );

  return buildProductListResponse({
    query: {
      ...query,
      page: pagination.currentPage,
    },
    products: pageProducts,
    pagination,
  });
}

// This wraps the common collection fetch shape used by browse, search, and
// category routes so the direct and fallback strategies can share one client path.
async function fetchProductCollection(
  baseRoute: ProductCollectionRoute,
  {
    limit,
    skip,
    init,
  }: {
    limit: number;
    skip: number;
    init?: ProductsApiFetchInit;
  },
) {
  const response = await fetchProductsApi<DummyJsonProductsResponse>(baseRoute.pathname, {
    searchParams: {
      ...baseRoute.searchParams,
      limit,
      skip,
    },
    init,
  });

  return normalizeProductsResponse(response);
}

function getSortDefinition(sort: SortOption | null) {
  if (!sort) {
    return null;
  }

  return PRODUCT_SORT_OPTIONS.find((option) => option.value === sort) ?? null;
}

// Search text and category are only applied here when the fallback route could
// not express them directly, which avoids redundant filtering for simpler cases.
function applyServerSideFilters(products: Product[], query: ProductQueryState) {
  return products.filter((product) => {
    if (query.category && product.category !== query.category) {
      return false;
    }

    if (
      query.search &&
      !`${product.title} ${product.description} ${product.brand ?? ""}`
        .toLowerCase()
        .includes(query.search.toLowerCase())
    ) {
      return false;
    }

    if (query.minPrice !== null && product.price < query.minPrice) {
      return false;
    }

    if (query.maxPrice !== null && product.price > query.maxPrice) {
      return false;
    }

    return true;
  });
}

// DummyJSON can sort directly for simple list modes, but the fallback path
// needs the same order reproduced on the server after filtering has happened.
function sortProducts(products: Product[], sort: SortOption | null) {
  if (!sort) {
    return products;
  }

  const sortedProducts = [...products];

  sortedProducts.sort((leftProduct, rightProduct) => {
    switch (sort) {
      case "title-asc":
        return leftProduct.title.localeCompare(rightProduct.title);
      case "title-desc":
        return rightProduct.title.localeCompare(leftProduct.title);
      case "price-asc":
        return leftProduct.price - rightProduct.price;
      case "price-desc":
        return rightProduct.price - leftProduct.price;
      case "rating-asc":
        return leftProduct.rating - rightProduct.rating;
      case "rating-desc":
        return rightProduct.rating - leftProduct.rating;
      default:
        return 0;
    }
  });

  return sortedProducts;
}

function buildProductListResponse({
  query,
  products,
  pagination,
}: {
  query: ProductQueryState;
  products: Product[];
  pagination: PaginationMeta;
}): ProductListResponse {
  return {
    products,
    total: pagination.totalItems,
    page: pagination.currentPage,
    perPage: pagination.perPage,
    totalPages: pagination.totalPages,
    hasNextPage: pagination.hasNextPage,
    hasPreviousPage: pagination.hasPreviousPage,
    query,
  };
}
