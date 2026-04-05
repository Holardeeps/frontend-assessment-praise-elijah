import type { ProductQueryState } from "./filters";

// These nested shapes mirror the richer product fields returned by DummyJSON,
// so we can type detailed product data without repeating inline object shapes.
export type ProductDimensions = {
  width: number;
  height: number;
  depth: number;
};

export type ProductReview = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
};

export type ProductMeta = {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
};

// This is the main domain product shape that the rest of the app will rely
// on once the API layer starts normalizing DummyJSON responses.
export type Product = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string | null;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  thumbnail: string;
  images: string[];
};

// This lean card model lets listing components receive only the data they need
// instead of depending on the entire product payload.
export type ProductCardModel = Pick<
  Product,
  "id" | "title" | "category" | "price" | "rating" | "stock"
> & {
  href: string;
  imageUrl: string;
  imageAlt: string;
  brand: string | null;
};

// This detail model starts from the full product data and adds only the extra
// navigation context the detail page will need for its breadcrumb flow.
export type ProductDetailModel = Product & {
  breadcrumbHref: string;
  breadcrumbLabel: string;
};

// This is the normalized listing payload our server page will consume after
// query parsing and API fetching have already resolved pagination details.
export type ProductListResponse = {
  products: Product[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  query: ProductQueryState;
};
