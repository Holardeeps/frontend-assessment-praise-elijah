import {
  getProductById,
  getRelatedProductsByCategory,
  ProductsApiError,
} from "@/lib/api/products";
import type { RelatedProductsApiResponse } from "@/types/api";
import { parseProductId } from "@/features/products/utils";

const DEFAULT_RELATED_PRODUCTS_LIMIT = 3;
const MAX_RELATED_PRODUCTS_LIMIT = 6;

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

  try {
    // This internal route gives future client-side enhancement hooks a stable
    // JSON surface for related products without duplicating category lookup
    // logic in the browser.
    const product = await getProductById(productId);
    const products = await getRelatedProductsByCategory(product.category, {
      excludeProductId: product.id,
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
