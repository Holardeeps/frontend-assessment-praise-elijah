import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { getRelatedProductsByCategory, ProductsApiError } from "@/lib/api/products";
import { createTradeLensQueryClient } from "@/lib/query/query-client";
import { productQueryKeys } from "@/lib/query/product-query-keys";

import { RelatedProductsClient } from "./related-products-client";
import { RelatedProductsMessage } from "./related-products-content";

type RelatedProductsProps = {
  category: string;
  currentProductId: number;
  returnHref: string;
};

export async function RelatedProducts({
  category,
  currentProductId,
  returnHref,
}: RelatedProductsProps) {
  const limit = 3;
  let relatedProducts;

  try {
    relatedProducts = await getRelatedProductsByCategory(category, {
      excludeProductId: currentProductId,
      limit,
    });
  } catch (error) {
    if (error instanceof ProductsApiError) {
      return <RelatedProductsMessage kind="unavailable" />;
    }

    throw error;
  }

  if (relatedProducts.length === 0) {
    return <RelatedProductsMessage kind="empty" />;
  }

  // This seeds the client cache with the streamed server result so revisits to
  // the same detail view can reuse the related-products payload immediately.
  const queryClient = createTradeLensQueryClient();
  queryClient.setQueryData(
    productQueryKeys.relatedProducts(currentProductId, limit),
    relatedProducts,
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RelatedProductsClient
        category={category}
        currentProductId={currentProductId}
        limit={limit}
        returnHref={returnHref}
      />
    </HydrationBoundary>
  );
}
