import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// This follows the local Next.js Vitest guide so our unit tests run in jsdom
// and still understand the app's existing TypeScript path aliases.
export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
});
