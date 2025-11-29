import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node", // security tests usually hit APIs, no DOM needed
    include: ["security/**/*.test.{ts,js}"],
    reporters: [
      "default",
      ["html", { outputFile: "security-report/index.html" }], // generate HTML report
      ...(process.env.CI ? ["github-actions"] : []),
    ],
  },
});
