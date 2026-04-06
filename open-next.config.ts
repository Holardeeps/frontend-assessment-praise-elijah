import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";
import doQueue from "@opennextjs/cloudflare/overrides/queue/do-queue";

// This adapter config tells OpenNext to use Cloudflare's R2-backed
// incremental cache strategy plus a durable revalidation queue, which keeps
// time-based cache refreshes synchronized once the app is deployed on Workers.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
  queue: doQueue,
});
