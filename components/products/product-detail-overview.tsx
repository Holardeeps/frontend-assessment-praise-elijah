import Image from "next/image";

import { formatCategoryLabel } from "@/features/products/utils";
import { formatCurrency, formatInteger } from "@/lib/utils/format-number";
import type { ProductDetailModel } from "@/types/product";

import { ProductBreadcrumb } from "./product-breadcrumb";

type ProductDetailOverviewProps = {
  product: ProductDetailModel;
};

export function ProductDetailOverview({
  product,
}: ProductDetailOverviewProps) {
  const primaryImage = product.images[0] || product.thumbnail;

  return (
    <section className="space-y-5">
      {/* The breadcrumb keeps the detail route connected to the exact catalog
          view the person came from while also establishing the current page. */}
      <ProductBreadcrumb
        href={product.breadcrumbHref}
        label={product.breadcrumbLabel}
        currentLabel={product.title}
      />

      <div className="rounded-panel-lg border border-line-soft bg-panel px-5 py-5 shadow-panel sm:px-6 sm:py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
          <div className="overflow-hidden rounded-panel-lg border border-line-soft bg-panel-soft">
            {primaryImage ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={primaryImage}
                  alt={product.title}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 44vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center px-6 text-center">
                <div>
                  <p className="section-kicker">Preview unavailable</p>
                  <p className="mt-2 text-base font-semibold text-ink sm:text-lg">
                    This product does not include a primary image yet.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="space-y-3">
              <p className="section-kicker">Product detail</p>

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

              <h1 className="text-balance text-3xl font-semibold leading-tight text-ink sm:text-4xl">
                {product.title}
              </h1>

              <p className="max-w-3xl text-base leading-7 text-copy-soft">
                {product.description}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <DetailMetric label="Price" value={formatCurrency(product.price)} />
              <DetailMetric label="Rating" value={product.rating.toFixed(1)} />
              <DetailMetric
                label="Stock"
                value={`${formatInteger(product.stock)} available`}
              />
              <DetailMetric label="Status" value={product.availabilityStatus} />
              <DetailMetric label="Shipping" value={product.shippingInformation} />
              <DetailMetric label="Warranty" value={product.warrantyInformation} />
            </div>

            <div className="grid gap-3 lg:grid-cols-2">
              <div className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
                <p className="metric-kicker">Operational details</p>
                <dl className="mt-3 space-y-3 text-sm text-copy-soft">
                  <div className="flex items-start justify-between gap-3">
                    <dt>SKU</dt>
                    <dd className="text-right font-semibold text-ink">{product.sku}</dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt>Minimum order</dt>
                    <dd className="text-right font-semibold text-ink">
                      {formatInteger(product.minimumOrderQuantity)}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <dt>Return policy</dt>
                    <dd className="text-right font-semibold text-ink">
                      {product.returnPolicy}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
                <p className="metric-kicker">Product tags</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.tags.length > 0 ? (
                    product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="pill bg-panel px-3 py-2 text-sm"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-copy-soft">
                      No tags are attached to this product yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type DetailMetricProps = {
  label: string;
  value: string;
};

function DetailMetric({ label, value }: DetailMetricProps) {
  return (
    <div className="rounded-panel-md border border-line-soft bg-panel-soft px-4 py-4">
      <p className="metric-kicker">{label}</p>
      <p className="mt-3 break-words text-sm font-semibold leading-6 text-ink sm:text-base">
        {value}
      </p>
    </div>
  );
}
