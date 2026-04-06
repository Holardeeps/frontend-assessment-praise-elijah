import openNextWorker from "./.open-next/worker.js";

export {
  DOQueueHandler,
  DOShardedTagCache,
  BucketCachePurge,
} from "./.open-next/worker.js";

function shouldMirrorCacheStatusHeader(url, response) {
  if (!(response instanceof Response)) {
    return false;
  }

  const isListingRoute = url.pathname === "/products" || url.pathname === "/products/";
  const nextCacheStatus = response.headers.get("x-nextjs-cache");

  return isListingRoute && typeof nextCacheStatus === "string" && nextCacheStatus.length > 0;
}

const worker = {
  async fetch(request, env, ctx) {
    const response = await openNextWorker.fetch(request, env, ctx);
    const url = new URL(request.url);

    if (!shouldMirrorCacheStatusHeader(url, response)) {
      return response;
    }

    const headers = new Headers(response.headers);
    headers.set("x-cache-status", headers.get("x-nextjs-cache"));

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

export default worker;
