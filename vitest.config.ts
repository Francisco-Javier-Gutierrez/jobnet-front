import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
      "@": path.resolve(__dirname, "./app"),
      "#imports": path.resolve(__dirname, "./test/mocks/imports.ts"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./test/setup.ts"],
    coverage: {
      provider: "v8",
      lines: 100,
      functions: 100,
      branches: 100,
      statements: 100,
    },
  },
});
