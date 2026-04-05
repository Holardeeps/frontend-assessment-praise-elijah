import type { Product } from "./product";

// This generic list wrapper mirrors DummyJSON's paginated collection shape,
// which lets the API layer reuse one response type across browse, search,
// and category endpoints.
export type DummyJsonCollectionResponse<TItem> = {
  products: TItem[];
  total: number;
  skip: number;
  limit: number;
};

// These category records match the richer category endpoint and give us a
// typed base for filter options later in the listing UI.
export type ProductCategory = {
  slug: string;
  name: string;
  url: string;
};

export type ProductCategorySlug = ProductCategory["slug"];

export type ProductCategoryList = ProductCategorySlug[];

export type DummyJsonProductsResponse = DummyJsonCollectionResponse<Product>;
