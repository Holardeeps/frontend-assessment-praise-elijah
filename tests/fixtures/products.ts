import type { Product } from "@/types/product";

// This gives product component tests one realistic default product shape so
// each spec can focus on the values it cares about instead of rebuilding the
// full DummyJSON-style object every time.
export function createTestProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 101,
    title: "Trade Monitor Display",
    description: "A compact display for tracking pricing and availability.",
    category: "smartphones",
    price: 1299,
    discountPercentage: 12.5,
    rating: 4.6,
    stock: 48,
    tags: ["inventory", "display"],
    brand: "Checkit Supply",
    sku: "CHK-101",
    weight: 2,
    dimensions: {
      width: 24,
      height: 16,
      depth: 2,
    },
    warrantyInformation: "2 year warranty",
    shippingInformation: "Ships in 2 business days",
    availabilityStatus: "In Stock",
    reviews: [],
    returnPolicy: "30 day returns",
    minimumOrderQuantity: 1,
    meta: {
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-02T00:00:00.000Z",
      barcode: "1234567890",
      qrCode: "https://example.com/qr.png",
    },
    thumbnail: "https://dummyjson.com/image/400x300",
    images: ["https://dummyjson.com/image/400x300"],
    ...overrides,
  };
}
