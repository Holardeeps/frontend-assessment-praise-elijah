"use client";

import Image from "next/image";
import { useState } from "react";

import { formatCategoryLabel } from "@/features/products/utils/format-category-label";

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
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowFallback = hasImageError || imageUrl.trim().length === 0;

  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-panel-md border border-line-soft bg-panel-soft">
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
          sizes="(min-width: 1280px) 28rem, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-200 ease-fluid hover:scale-[1.02]"
          onError={() => setHasImageError(true)}
        />
      )}
    </div>
  );
}
