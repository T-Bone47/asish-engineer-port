import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: {
      // Mirrors the `@/*` -> `./*` path mapping in tsconfig.json so tests
      // import from the same specifiers the source does.
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
});