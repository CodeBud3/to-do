import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // Simulates a browser environment
    setupFiles: "./src/test/setup.ts", // Setup file for global configs
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json", "html"], // Generate JSON for test-reporter
      reportsDirectory: "./coverage",
      exclude: [
        ...configDefaults.exclude,
        "**/__mocks__/**",
        "./src/main.tsx",
        "./src/vite-env.d.ts",
        "**/*.types.tsx",
        "**/*.types.ts",
      ],
      thresholds: {
        lines: 90,
        branches: 80,
        functions: 80,
        statements: 90,
      },
    },
  },
});
