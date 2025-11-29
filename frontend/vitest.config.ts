// vitest.config.ts
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

// The defineConfig utility from 'vitest/config' is used to define Vitest-specific
// configuration. We use mergeConfig to combine it with the settings from vite.config.ts.
export default mergeConfig(
  viteConfig,
  defineConfig({
    // You can put any test-only overrides here if needed,
    // but typically leaving it empty works as it inherits the 'test' block from vite.config.ts
    test: {
      reporters: [
        "default",
        "html",
        ...(process.env.CI ? ["github-actions"] : []),
      ],
    },
  })
);
