import { cache, Suspense } from "react";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetailOverview } from "@/components/products/product-detail-overview";
import { RelatedProducts } from "@/components/products/related-products";
import { RelatedProductsSkeleton } from "@/components/products/related-products-skeleton";
import { NavBar } from "@/components/shared/nav-bar";
import { PRODUCT_FILTER_SECTION_ID } from "@/features/products/constants";
import {
  parseProductId,
  resolveProductReturnHref,
} from "@/features/products/utils";
import { getProductById, ProductsApiError } from "@/lib/api/products";
import type { Product, ProductDetailModel } from "@/types/product";

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

// The detail page and its metadata need the same product data, so this cached
// wrapper keeps the request shared across both code paths during a render pass.
const getCachedProductDetail = cache(async (productId: number) => {
  return getProductById(productId);
});

function buildProductMetadata(product: Product): Metadata {
  const description =
    product.description.trim() ||
    `Explore pricing, availability, and operational details for ${product.title}.`;
  const primaryImage = product.images[0] || product.thumbnail || undefined;

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      type: "website",
      images: primaryImage
        ? [
            {
              url: primaryImage,
              alt: product.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: primaryImage ? "summary_large_image" : "summary",
      title: product.title,
      description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const productId = parseProductId(id);

  if (productId === null) {
    return {
      title: "Product unavailable",
      description: "This catalog item could not be found in TradeLens.",
    };
  }

  try {
    const product = await getCachedProductDetail(productId);

    return buildProductMetadata(product);
  } catch (error) {
    if (error instanceof ProductsApiError && error.status === 404) {
      return {
        title: "Product unavailable",
        description: "This catalog item could not be found in TradeLens.",
      };
    }

    return {
      title: "Product temporarily unavailable",
      description:
        "TradeLens could not load this product right now. Please try again shortly.",
    };
  }
}

export default async function ProductDetailPage({
  params,
  searchParams,
}: ProductDetailPageProps) {
  const [{ id }, rawSearchParams] = await Promise.all([params, searchParams]);
  const productId = parseProductId(id);

  if (productId === null) {
    notFound();
  }

  const returnHref = resolveProductReturnHref(rawSearchParams.from);
  let product;

  try {
    product = await getCachedProductDetail(productId);
  } catch (error) {
    if (error instanceof ProductsApiError && error.status === 404) {
      notFound();
    }

    throw error;
  }

  const detailModel: ProductDetailModel = {
    ...product,
    breadcrumbHref: returnHref,
    breadcrumbLabel: "Catalog results",
  };

  return (
    <main id="main-content" className="pb-14 sm:pb-16 lg:pb-20">
      <NavBar
        items={navItems}
        cta={{ href: returnHref, label: "Back to catalog" }}
      />

      <section className="page-gutter space-y-8 pt-6 sm:pt-8">
        <ProductDetailOverview product={detailModel} />

        {/* This Suspense boundary keeps the primary product detail available
            immediately while related recommendations stream in separately. */}
        <Suspense fallback={<RelatedProductsSkeleton />}>
          <RelatedProducts
            category={detailModel.category}
            currentProductId={detailModel.id}
            returnHref={returnHref}
          />
        </Suspense>
      </section>
    </main>
  );
}
