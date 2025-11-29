import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client";
import { TEST_PRODUCT, createTestResult } from "../utils/test-utils.js";

describe("CSRF Tests", () => {
  let client: SecurityTestClient;

  beforeEach(async () => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should require authentication for protected endpoints", async () => {
    const endpoints = [
      { method: "GET", url: "/products" },
      { method: "POST", url: "/products", data: TEST_PRODUCT },
      { method: "PUT", url: "/products/1", data: TEST_PRODUCT },
      { method: "DELETE", url: "/products/1" },
    ];

    const results = [];

    for (const endpoint of endpoints) {
      try {
        client.clearAuth();

        const response = await client.request(
          endpoint.method,
          endpoint.url,
          endpoint.data
        );

        const result = createTestResult(
          `CSRF/Auth - ${endpoint.method} ${endpoint.url} without auth`,
          "HIGH",
          response.status === 401 || response.status === 403,
          "response.status === 401 || response.status === 403",
          "Should reject requests without valid authentication",
          `Received status ${response.status}`,
          `Test access to protected endpoint without authentication`,
          { method: endpoint.method, url: endpoint.url, authenticated: false },
          { status: response.status }
        );

        results.push(result);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `CSRF/Auth - ${endpoint.method} ${endpoint.url} without auth`,
          "HIGH",
          status === 401 || status === 403,
          "status === 401 || status === 403",
          "Should reject requests without valid authentication",
          `Received status ${status}`,
          `Test access to protected endpoint without authentication`,
          { method: endpoint.method, url: endpoint.url, authenticated: false },
          { status }
        );
        results.push(result);
      }
    }

    // Assert all results at the end
    const failedResults = results.filter((r) => !r.passed);
    expect(failedResults.length, JSON.stringify(failedResults, null, 2)).toBe(
      0
    );
  });

  it("should reject requests with invalid tokens", async () => {
    const results = [];

    client.setToken("invalid-token-here");

    try {
      const response = await client.get("/products");

      const result = createTestResult(
        "CSRF/Auth - Request with invalid token",
        "MEDIUM",
        response.status === 401,
        "response.status === 401",
        "Should reject requests with invalid JWT tokens",
        `Received status ${response.status}`,
        "Test API with invalid JWT token",
        { method: "GET", url: "/products", token: "invalid-token-here" },
        { status: response.status },
        "Implement proper JWT validation with signature verification"
      );

      results.push(result);
    } catch (error: any) {
      const status = error.response?.status;
      const result = createTestResult(
        "CSRF/Auth - Request with invalid token",
        "MEDIUM",
        status === 401,
        "status === 401",
        "Should reject requests with invalid JWT tokens",
        `Received status ${status}`,
        "Test API with invalid JWT token",
        { method: "GET", url: "/products", token: "invalid-token-here" },
        { status }
      );
      results.push(result);
    }

    // Assert all results at the end
    const failedResults = results.filter((r) => !r.passed);
    expect(failedResults.length, JSON.stringify(failedResults, null, 2)).toBe(
      0
    );
  });
});
