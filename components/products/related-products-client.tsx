"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchRelatedProducts } from "@/lib/query/related-products";
import { productQueryKeys } from "@/lib/query/product-query-keys";

import {
  RelatedProductsContent,
  RelatedProductsMessage,
} from "./related-products-content";

type RelatedProductsClientProps = {
  category: string;
  currentProductId: number;
  limit: number;
  returnHref: string;
};

export function RelatedProductsClient({
  category,
  currentProductId,
  limit,
  returnHref,
}: RelatedProductsClientProps) {
  const { data: relatedProducts, isError } = useQuery({
    queryKey: productQueryKeys.relatedProducts(currentProductId, limit),
    queryFn: () => fetchRelatedProducts(currentProductId, limit, category),
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
