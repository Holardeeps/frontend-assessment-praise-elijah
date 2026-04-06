import {
  getProductById,
  getRelatedProductsByCategory,
  ProductsApiError,
} from "@/lib/api/products";
import type { RelatedProductsApiResponse } from "@/types/api";
import { parseProductId } from "@/features/products/utils";

const DEFAULT_RELATED_PRODUCTS_LIMIT = 3;
const MAX_RELATED_PRODUCTS_LIMIT = 6;

// This keeps the enhancement route aligned with the short-lived detail cache
// window so related-product JSON and the streamed detail page age together.
export const revalidate = 180;

function parseRelatedProductsLimit(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const rawLimit = searchParams.get("limit");

  if (!rawLimit) {
    return DEFAULT_RELATED_PRODUCTS_LIMIT;
  }

  const parsedLimit = Number(rawLimit);

  if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
    return DEFAULT_RELATED_PRODUCTS_LIMIT;
  }

  return Math.min(parsedLimit, MAX_RELATED_PRODUCTS_LIMIT);
}

function parseRelatedProductsCategory(request: Request) {
  const rawCategory = new URL(request.url).searchParams.get("category");

  if (!rawCategory) {
    return null;
  }

  const normalizedCategory = rawCategory.trim().toLowerCase();

  return normalizedCategory.length > 0 ? normalizedCategory : null;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const productId = parseProductId(id);

  if (productId === null) {
    return Response.json(
      {
        error: "A valid product id is required.",
      },
      { status: 400 },
    );
  }

  const limit = parseRelatedProductsLimit(request);
  const relatedCategory = parseRelatedProductsCategory(request);

  try {
    // This internal route gives future client-side enhancement hooks a stable
    // JSON surface for related products without duplicating category lookup
    // logic in the browser.
    const category =
      relatedCategory ?? (await getProductById(productId)).category;
    const products = await getRelatedProductsByCategory(category, {
      excludeProductId: productId,
      limit,
    });
    const payload: RelatedProductsApiResponse = { products };

    return Response.json(payload);
  } catch (error) {
    if (error instanceof ProductsApiError) {
      if (error.status === 404) {
        return Response.json(
          {
            error: "This product could not be found.",
          },
          { status: 404 },
        );
      }

      return Response.json(
        {
          error: "Related products are temporarily unavailable.",
        },
        { status: 503 },
      );
    }

    throw error;
  }
}
