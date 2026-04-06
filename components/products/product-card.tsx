import Link from "next/link";

import type { Product } from "@/types/product";
import { formatCurrency, formatInteger } from "@/lib/utils/format-number";
import { formatCategoryLabel } from "@/features/products/utils/format-category-label";

import { ProductCardImage } from "./product-card-image";

type ProductCardProps = {
  product: Product;
  href: string;
};

export function ProductCard({ product, href }: ProductCardProps) {
  const primaryImage = product.images[0] || product.thumbnail;

  return (
    <article className="product-card rounded-panel-lg border border-line-soft bg-panel p-3 shadow-panel transition-transform duration-150 ease-fluid hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:border-line-strong sm:p-4">
      {/* The whole card links into the detail page so the listing feels like a
          real catalog surface and preserves the current result context. */}
      <Link
        href={href}
        aria-label={`View details for ${product.title}`}
        className="product-card-link block h-full rounded-panel-lg focus-visible:outline-none"
      >
        <ProductCardImage
          imageUrl={primaryImage}
          title={product.title}
          category={product.category}
        />

        <div className="product-card-content mt-4 flex flex-col gap-3 xs:flex-row xs:items-start xs:justify-between">
          <div className="product-card-copy min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="pill bg-panel-soft px-3 py-2 text-sm">
                {formatCategoryLabel(product.category)}
              </span>
              {product.brand ? (
                <span className="break-words text-sm font-semibold text-copy-soft">
                  {product.brand}
                </span>
              ) : null}
            </div>

            <h3 className="card-title break-words text-ink">{product.title}</h3>
            <p className="break-words text-sm leading-6 text-copy-soft">
              {product.description}
            </p>
          </div>

          <div className="product-card-rating shrink-0 self-start rounded-full border border-line-soft bg-panel-soft px-3 py-2 text-sm font-semibold text-ink">
            {product.rating.toFixed(1)}
          </div>
        </div>

        <div className="product-card-footer mt-5 space-y-4">
          <div className="product-card-metrics grid gap-2 xs:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-panel-md border border-line-soft bg-panel-soft px-3 py-3">
              <p className="metric-kicker">
                Price
              </p>
              <p className="mt-2 break-words text-sm font-semibold text-ink sm:text-base">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="rounded-panel-md border border-line-soft bg-panel-soft px-3 py-3">
              <p className="metric-kicker">
                Stock
              </p>
              <p className="mt-2 break-words text-sm font-semibold text-ink sm:text-base">
                {formatInteger(product.stock)} available
              </p>
            </div>

            <div className="rounded-panel-md border border-line-soft bg-panel-soft px-3 py-3">
              <p className="metric-kicker">
                Status
              </p>
              <p className="mt-2 break-words text-sm font-semibold text-ink sm:text-base">
                {product.availabilityStatus}
              </p>
            </div>
          </div>

          <div className="product-card-chips flex flex-wrap gap-2">
            {product.discountPercentage > 0 ? (
              <span className="pill bg-panel-soft px-3 py-2 text-sm">
                {product.discountPercentage.toFixed(0)}% off
              </span>
            ) : null}
            <span className="pill bg-panel-soft px-3 py-2 text-sm">
              Rating {product.rating.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
