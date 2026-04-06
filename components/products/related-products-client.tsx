"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchRelatedProducts } from "@/lib/query/related-products";
import { productQueryKeys } from "@/lib/query/product-query-keys";

import {
  RelatedProductsContent,
  RelatedProductsMessage,
} from "./related-products-content";

type RelatedProductsClientProps = {
  currentProductId: number;
  limit: number;
  returnHref: string;
};

export function RelatedProductsClient({
  currentProductId,
  limit,
  returnHref,
}: RelatedProductsClientProps) {
  const { data: relatedProducts, isError } = useQuery({
    queryKey: productQueryKeys.relatedProducts(currentProductId, limit),
    queryFn: () => fetchRelatedProducts(currentProductId, limit),
  });

  if (isError) {
    return <RelatedProductsMessage kind="unavailable" />;
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return <RelatedProductsMessage kind="empty" />;
  }

  return (
    <RelatedProductsContent
      products={relatedProducts}
      returnHref={returnHref}
    />
  );
}
