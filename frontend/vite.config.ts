import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 3000,
  },
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  test: {
    environment: "happy-dom",
    setupFiles: ["./src/setupTests.ts"],
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      enabled: true,
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        ...configDefaults.exclude,
        "src/**/*.d.ts",
        "src/main.tsx",
        "src/reportWebVitals.ts",
      ],
    },
  },
});
