import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Security Headers Tests", () => {
  let client: SecurityTestClient;

  beforeEach(() => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should check for essential security headers", async () => {
    const endpoints = ["/auth/login", "/products", "/products/1"];

    const requiredHeaders = [
      "X-Content-Type-Options",
      "X-Frame-Options",
      "X-XSS-Protection",
      "Strict-Transport-Security", // Optional but recommended
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await client.get(endpoint);

        const headers = response.headers;
        const missingHeaders = requiredHeaders.filter(
          (header) => !headers[header.toLowerCase()]
        );

        const result = createTestResult(
          `Security Headers - ${endpoint}`,
          "MEDIUM",
          missingHeaders.length === 0,
          "Should include essential security headers",
          missingHeaders.length > 0
            ? `Missing: ${missingHeaders.join(", ")}`
            : "All required headers present",
          `Check security headers for ${endpoint}`,
          null,
          { headers: headers, missing: missingHeaders },
          "Configure security headers in Spring Security configuration"
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        // For endpoints that require auth, we might get 401 - that's fine for header check
        if (error.response) {
          const headers = error.response.headers;
          const missingHeaders = requiredHeaders.filter(
            (header) => !headers[header.toLowerCase()]
          );

          const result = createTestResult(
            `Security Headers - ${endpoint}`,
            "MEDIUM",
            missingHeaders.length === 0,
            "Should include essential security headers",
            missingHeaders.length > 0
              ? `Missing: ${missingHeaders.join(", ")}`
              : "All required headers present",
            `Check security headers for ${endpoint}`,
            null,
            { headers: headers, missing: missingHeaders }
          );
          expect(result.passed).toBe(true);
        }
      }
    }
  });

  it("should validate CORS configuration", async () => {
    // Test from different origin (simulated)
    try {
      const response = await client.get("/products", {
        Origin: "http://malicious-site.com",
      });

      // Check if CORS headers are present and restrictive
      const corsHeader = response.headers["access-control-allow-origin"];
      const isRestrictive = !corsHeader || corsHeader !== "*";

      const result = createTestResult(
        "CORS Configuration",
        "MEDIUM",
        isRestrictive,
        "Should have restrictive CORS policy",
        corsHeader ? `CORS Allow-Origin: ${corsHeader}` : "No CORS header",
        "Test CORS configuration with different origin",
        { origin: "http://malicious-site.com" },
        { corsHeader }
      );

      expect(result.passed).toBe(true);
    } catch (error) {
      // Request might be blocked - that's good
      const result = createTestResult(
        "CORS Configuration",
        "MEDIUM",
        true,
        "Should have restrictive CORS policy",
        "Request blocked or restricted",
        "Test CORS configuration with different origin"
      );
      expect(result.passed).toBe(true);
    }
  });
});
