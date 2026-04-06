import Link from "next/link";

type ProductBreadcrumbProps = {
  href: string;
  label: string;
  currentLabel: string;
};

export function ProductBreadcrumb({
  href,
  label,
  currentLabel,
}: ProductBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-copy-soft">
        <li>
          <Link
            href={href}
            className="font-semibold text-copy-soft transition-colors duration-150 ease-fluid hover:text-ink"
          >
            {label}
          </Link>
        </li>
        <li aria-hidden="true" className="text-copy-soft">
          /
        </li>
        <li className="min-w-0">
          <span className="block truncate font-semibold text-ink" aria-current="page">
            {currentLabel}
          </span>
        </li>
      </ol>
    </nav>
  );
}
