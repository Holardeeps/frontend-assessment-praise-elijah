import type { Product } from "@/types/product";
import { formatCurrency, formatInteger } from "@/lib/utils/format-number";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="rounded-panel-md border border-line-soft bg-panel px-4 py-4 shadow-panel transition-transform duration-150 ease-fluid hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-deep">
            {product.category}
          </p>
          <h3 className="mt-2 text-[1.15rem] text-ink">
            {product.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-copy-soft">
            {product.description}
          </p>
        </div>

        <div className="rounded-full border border-line-soft bg-panel-soft px-3 py-2 text-sm font-semibold text-ink">
          {product.rating.toFixed(1)}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="pill bg-panel-soft px-3 py-2 text-sm">
          {formatCurrency(product.price)}
        </span>
        <span className="pill bg-panel-soft px-3 py-2 text-sm">
          Stock {formatInteger(product.stock)}
        </span>
        {product.brand ? (
          <span className="pill bg-panel-soft px-3 py-2 text-sm">
            {product.brand}
          </span>
        ) : null}
      </div>
    </article>
  );
}
