import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// This adapter config tells OpenNext to use Cloudflare's R2-backed
// incremental cache strategy. The matching Wrangler bucket binding will be
// added in phase 4, so this file and the Wrangler config stay aligned.
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});
