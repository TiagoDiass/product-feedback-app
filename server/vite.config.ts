import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    coverage: {
      provider: "v8",
      exclude: [
        "node_modules",
        "dist",
        "./vite.config.ts",
        "src/domain/repositories/index.ts",
      ],
    },
  },
});
