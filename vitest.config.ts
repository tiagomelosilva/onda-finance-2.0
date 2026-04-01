import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/tests/**/*.test.ts?(x)"],
    exclude: ["jobz-teste1.0/**", "dist/**", "node_modules/**"],
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.ts",
    css: true,
  },
});
