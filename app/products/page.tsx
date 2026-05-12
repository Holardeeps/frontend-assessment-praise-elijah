import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import {
  buildProductsHref,
  parseProductQuery,
} from "@/features/products/utils";
import {
  getProductCategories,
  getProductList,
  ProductsApiError,
} from "@/lib/api/products";
import { formatInteger } from "@/lib/utils/format-number";
import { getAverageRating } from "@/lib/utils/products-stats";
import { createTradeLensQueryClient } from "@/lib/query/query-client";
import { productQueryKeys } from "@/lib/query/product-query-keys";
import { ProductsServiceUnavailable } from "@/components/products/products-service-unavailable";
import { ProductFiltersShell } from "@/components/products/product-filters-shell";
import { NavBar } from "@/components/shared/nav-bar";
import { ProductCategoryStrip } from "@/components/products/product-category-strip";
import { ProductsOverview } from "@/components/products/products-overview";
import { ProductsResults } from "@/components/products/products-results";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";

const navItems = [
  { label: "Overview", href: "#overview" },
  { label: "Filters", href: `#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "#results" },
  { label: "Categories", href: "#categories" },
];

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = await parseProductQuery(searchParams);
  const categoriesPromise = getProductCategories().catch((error) => {
    if (error instanceof ProductsApiError) {
      return [];
    }

    throw error;
  });

  let productList;

  try {
    productList = await getProductList(query);
  } catch (error) {
    if (!(error instanceof ProductsApiError)) {
      throw error;
    }

    const categories = await categoriesPromise;
    const retryHref = buildProductsHref(query);

    return (
      <main id="main-content" className="pb-14 sm:pb-16 lg:pb-20">
        <NavBar
          items={navItems}
          cta={{ href: "#results", label: "View results" }}
        />

        <section className="page-gutter space-y-8 pt-6 sm:pt-8">
          <ProductFiltersShell
            categories={categories}
            query={query}
            categoryCount={categories.length}
          />

          <ProductsServiceUnavailable
            retryHref={retryHref}
            resetHref="/products"
          />

          {categories.length > 0 ? (
            <ProductCategoryStrip categories={categories} />
          ) : null}
        </section>
      </main>
    );
  }

  const categories = await categoriesPromise;
  const averageRating = getAverageRating(productList.products);

  const queryClient = createTradeLensQueryClient();
  queryClient.setQueryData(
    productQueryKeys.listing(productList.query),
    productList,
  );

  return (
    <main id="main-content" className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: "#results", label: "View results" }}
      />

      <section className="page-gutter space-y-8 pt-6 sm:pt-8">
        <ProductsOverview
          totalResults={formatInteger(productList.total)}
          currentPageLabel={`${productList.page}/${Math.max(productList.totalPages, 1)}`}
          averageRating={averageRating}
          categoryCount={formatInteger(categories.length)}
        />

        <ProductFiltersShell
          categories={categories}
          query={productList.query}
          categoryCount={categories.length}
        />

        <ProductCategoryStrip categories={categories} />

        <HydrationBoundary state={dehydrate(queryClient)}>
          <ProductsResults query={productList.query} />
        </HydrationBoundary>
      </section>
    </main>
  );
}
