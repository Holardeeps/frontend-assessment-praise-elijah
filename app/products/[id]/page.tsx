import { notFound } from "next/navigation";

import { ProductDetailOverview } from "@/components/products/product-detail-overview";
import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";
import { resolveProductReturnHref } from "@/features/products/utils";
import { getProductById, ProductsApiError } from "@/lib/api/products";
import type { ProductDetailModel } from "@/types/product";

const navItems = [
  { label: "Overview", href: "/products#overview" },
  { label: "Filters", href: `/products#${PRODUCT_FILTER_SECTION_ID}` },
  { label: "Results", href: "/products#results" },
  { label: "Categories", href: "/products#categories" },
];

type ProductDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId < 1) {
    notFound();
  }

  const returnHref = resolveProductReturnHref(rawSearchParams.from);
  let product;

  try {
    product = await getProductById(productId);
  } catch (error) {
    if (error instanceof ProductsApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const detailModel: ProductDetailModel = {
    ...product,
    breadcrumbHref: returnHref,
    breadcrumbLabel: "Back to catalog",
  };

  return (
    <main className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: returnHref, label: "Back to catalog" }}
      />

      <section className="page-gutter space-y-8 pt-6 sm:pt-8">
        <ProductDetailOverview product={detailModel} />
      </section>
    </main>
  );
}
