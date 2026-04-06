export function shouldBypassNextImageOptimization(
  imageUrl: string | null | undefined,
) {
  if (!imageUrl) {
    return false;
  }

  try {
    const normalizedImageUrl = imageUrl.trim();

    if (normalizedImageUrl.length === 0) {
      return false;
    }

    const { hostname } = new URL(normalizedImageUrl);

    const isDummyJsonHost =
      hostname === "dummyjson.com" || hostname.endsWith(".dummyjson.com");
    const shouldBypassInThisRuntime =
      process.env.BYPASS_REMOTE_IMAGE_OPTIMIZATION === "true" ||
      process.env.NODE_ENV !== "production";

    // In development we bypass DummyJSON-hosted images so local debugging and
    // preview sessions are less noisy. Production keeps image optimization on
    // by default so Lighthouse and real users still benefit from responsive
    // image resizing and modern formats.
    return isDummyJsonHost && shouldBypassInThisRuntime;
  } catch {
    return false;
  }
}
