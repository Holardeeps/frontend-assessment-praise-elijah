import Image from "next/image";

import { formatCategoryLabel } from "@/features/products/utils/format-category-label";
import { shouldBypassNextImageOptimization } from "@/lib/utils/should-bypass-next-image-optimization";

type ProductCardImageProps = {
  imageUrl: string;
  title: string;
  category: string;
};

export function ProductCardImage({
  imageUrl,
  title,
  category,
}: ProductCardImageProps) {
  const shouldShowFallback = imageUrl.trim().length === 0;
  const bypassOptimization = shouldBypassNextImageOptimization(imageUrl);

  return (
    <div className="product-card-image-shell relative aspect-4/3 overflow-hidden rounded-panel-md border border-line-soft bg-panel-soft">
      {shouldShowFallback ? (
        <div className="flex h-full flex-col justify-between p-4">
          <span className="eyebrow">Catalog view</span>
          <div>
            <p className="metric-kicker">
              {formatCategoryLabel(category)}
            </p>
            <p className="mt-2 max-w-56 break-words text-base font-semibold leading-6 text-ink sm:text-lg">
              {title}
            </p>
            <p className="mt-3 text-sm leading-6 text-copy-soft">
              Preview unavailable for this item right now.
            </p>
          </div>
        </div>
      ) : (
        <Image
          src={imageUrl}
          alt={title}
          fill
          unoptimized={bypassOptimization}
          sizes="(min-width: 1140px) 26rem, (min-width: 768px) 42vw, 92vw"
          className="object-cover transition-transform duration-200 ease-fluid hover:scale-[1.02]"
        />
      )}
    </div>
  );
}
