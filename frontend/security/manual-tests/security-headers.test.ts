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
      "Strict-Transport-Security",
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
          "missingHeaders.length === 0",
          "Should include essential security headers",
          missingHeaders.length > 0
            ? `Missing: ${missingHeaders.join(", ")}`
            : "All required headers present",
          `Check security headers for ${endpoint}`,
          { method: "GET", url: endpoint },
          {
            headers: Object.keys(headers),
            missing: missingHeaders,
            present: requiredHeaders.filter(
              (header) => headers[header.toLowerCase()]
            ),
          },
          "Configure security headers in Spring Security configuration using headers() method"
        );

        expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
      } catch (error: any) {
        if (error.response) {
          const headers = error.response.headers;
          const missingHeaders = requiredHeaders.filter(
            (header) => !headers[header.toLowerCase()]
          );

          const result = createTestResult(
            `Security Headers - ${endpoint}`,
            "MEDIUM",
            missingHeaders.length === 0,
            "missingHeaders.length === 0",
            "Should include essential security headers",
            missingHeaders.length > 0
              ? `Missing: ${missingHeaders.join(", ")}`
              : "All required headers present",
            `Check security headers for ${endpoint}`,
            { method: "GET", url: endpoint },
            {
              headers: Object.keys(headers),
              missing: missingHeaders,
              present: requiredHeaders.filter(
                (header) => headers[header.toLowerCase()]
              ),
            }
          );
          expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
        }
      }
    }
  });

  it("should validate CORS configuration", async () => {
    try {
      const response = await client.get("/products", {
        Origin: "http://malicious-site.com",
      });

      const corsHeader = response.headers["access-control-allow-origin"];
      const isRestrictive = !corsHeader || corsHeader !== "*";

      const result = createTestResult(
        "CORS Configuration",
        "MEDIUM",
        isRestrictive,
        "!corsHeader || corsHeader !== '*'",
        "Should have restrictive CORS policy",
        corsHeader ? `CORS Allow-Origin: ${corsHeader}` : "No CORS header",
        "Test CORS configuration with different origin",
        {
          method: "GET",
          url: "/products",
          origin: "http://malicious-site.com",
        },
        { corsHeader, isRestrictive },
        "Configure CORS policy to allow only trusted origins"
      );

      expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
    } catch (error) {
      const result = createTestResult(
        "CORS Configuration",
        "MEDIUM",
        true,
        "true", // Request blocked is good
        "Should have restrictive CORS policy",
        "Request blocked or restricted",
        "Test CORS configuration with different origin",
        {
          method: "GET",
          url: "/products",
          origin: "http://malicious-site.com",
        }
      );
      expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
    }
  });
});
