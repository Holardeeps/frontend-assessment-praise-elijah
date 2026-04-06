"use client";

import { usePathname, useRouter } from "next/navigation";

import { SelectMenu, type SelectMenuOption } from "@/components/ui/select-menu";
import { buildProductsFilterHref } from "@/features/products/utils";
import type { ProductQueryState } from "@/types/filters";

type ProductFilterSelectProps = {
  filterKey: "category" | "sort";
  label: string;
  options: SelectMenuOption[];
  query: ProductQueryState;
  value: string;
};

export function ProductFilterSelect({
  filterKey,
  label,
  options,
  query,
  value,
}: ProductFilterSelectProps) {
  const router = useRouter();
  const pathname = usePathname();

  // This keeps select-based filters using the same URL-first flow as search,
  // so every control updates the listing through the route state.
  const handleChange = (nextValue: string) => {
    const nextHref =
      filterKey === "category"
        ? buildProductsFilterHref(query, {
            category: nextValue || null,
          })
        : buildProductsFilterHref(query, {
            sort: (nextValue || null) as ProductQueryState["sort"],
          });

    if (nextHref === pathname) {
      return;
    }

    router.replace(nextHref, { scroll: false });
  };

  return (
    <SelectMenu
      label={label}
      options={options}
      value={value}
      onChange={handleChange}
    />
  );
}
