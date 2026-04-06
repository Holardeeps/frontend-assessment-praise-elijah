import { parseProductQuery } from "@/features/products/utils";
import { getProductList, ProductsApiError } from "@/lib/api/products";
import type { ProductListResponse } from "@/types/product";

// This keeps the enhancement route on the same short revalidation window as
// the server-rendered catalog list so client-prefetched JSON stays aligned with
// the main listing experience.
export const revalidate = 180;

function buildProductRouteSearchParams(request: Request) {
  const searchParams = new URL(request.url).searchParams;

  return {
    search: searchParams.getAll("search"),
    category: searchParams.getAll("category"),
    minPrice: searchParams.getAll("minPrice"),
    maxPrice: searchParams.getAll("maxPrice"),
    sort: searchParams.getAll("sort"),
    page: searchParams.getAll("page"),
  };
}

export async function GET(request: Request) {
  try {
    // This internal route exposes the same normalized listing payload used by
    // the server page so client-side enhancement hooks can reuse one contract.
    const query = await parseProductQuery(buildProductRouteSearchParams(request));
    const productList = await getProductList(query);
    const payload: ProductListResponse = productList;

    return Response.json(payload);
  } catch (error) {
    if (error instanceof ProductsApiError) {
      return Response.json(
        {
          error: "Catalog results are temporarily unavailable.",
        },
        { status: 503 },
      );
    }

    throw error;
  }
}
