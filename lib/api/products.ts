import type {
  DummyJsonProductsResponse,
  ProductCategory,
  ProductCategoryList,
  ProductCategorySlug,
} from "@/types/api";
import type { Product } from "@/types/product";

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
};

const DEFAULT_PRODUCTS_API_BASE_URL = "https://dummyjson.com";

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
  { searchParams, init }: ProductsApiRequestOptions = {},
): Promise<TResponse> {
  const url = buildProductsApiUrl(pathname, searchParams);
  const response = await fetch(url, {
    ...init,
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
  const product = await fetchProductsApi<Product>(`/products/${id}`, { init });

  return normalizeProduct(product);
}

export async function getProductCategories(init?: ProductsApiFetchInit) {
  const categories = await fetchProductsApi<ProductCategory[]>("/products/categories", {
    init,
  });

  return normalizeProductCategoryList(categories);
}

export async function getProductCategorySlugs(init?: ProductsApiFetchInit) {
  const categories = await fetchProductsApi<ProductCategoryList>("/products/category-list", {
    init,
  });

  return normalizeProductCategoryList(categories);
}
