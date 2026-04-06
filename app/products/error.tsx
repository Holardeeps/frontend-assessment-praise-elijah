"use client";

import { ProductsRouteError } from "@/components/products/products-route-error";

type ProductsErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function Error({
  error,
  unstable_retry,
}: ProductsErrorPageProps) {
  return (
    <ProductsRouteError error={error} unstable_retry={unstable_retry} />
  );
}
