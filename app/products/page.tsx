import {
  getProductQuerySummary,
  parseProductQuery,
} from "@/features/products/utils";
import { getProductCategories, getProductList } from "@/lib/api/products";
import { formatInteger } from "@/lib/utils/format-number";
import { NavBar } from "@/components/shared/nav-bar";
import { ProductCategoryStrip } from "@/components/products/product-category-strip";
import { ProductsOverview } from "@/components/products/products-overview";
import { ProductsResults } from "@/components/products/products-results";

const navItems = [
  { label: "Overview", href: "#overview" },
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
  const [productList, categories] = await Promise.all([
    getProductList(query),
    getProductCategories(),
  ]);
  const averageRating =
    productList.products.length > 0
      ? (
          productList.products.reduce(
            (total, product) => total + product.rating,
            0,
          ) / productList.products.length
        ).toFixed(1)
      : "0.0";
  const querySummary = getProductQuerySummary(productList.query);

  return (
    <main className="pb-14 sm:pb-16 lg:pb-20">
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
          querySummary={querySummary}
        />

        <ProductCategoryStrip categories={categories} />

        <ProductsResults productList={productList} />
      </section>
    </main>
  );
}
