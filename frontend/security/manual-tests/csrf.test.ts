import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { TEST_PRODUCT, createTestResult } from "../utils/test-utils.js";

describe("CSRF Tests", () => {
  let client: SecurityTestClient;

  beforeEach(async () => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should require authentication for protected endpoints", async () => {
    const endpoints = [
      { method: "GET", url: "/api/products" },
      { method: "POST", url: "/api/products", data: TEST_PRODUCT },
      { method: "PUT", url: "/api/products/1", data: TEST_PRODUCT },
      { method: "DELETE", url: "/api/products/1" },
    ];

    for (const endpoint of endpoints) {
      try {
        // Clear authentication
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
          "Should reject requests without valid authentication",
          `Received status ${response.status}`,
          `Test access to protected endpoint without authentication`
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `CSRF/Auth - ${endpoint.method} ${endpoint.url} without auth`,
          "HIGH",
          status === 401 || status === 403,
          "Should reject requests without valid authentication",
          `Received status ${status}`,
          `Test access to protected endpoint without authentication`
        );
        expect(result.passed).toBe(true);
      }
    }
  });

  it("should reject requests with invalid tokens", async () => {
    client.setToken("invalid-token-here");

    try {
      const response = await client.get("/api/products");

      const result = createTestResult(
        "CSRF/Auth - Request with invalid token",
        "MEDIUM",
        response.status === 401,
        "Should reject requests with invalid JWT tokens",
        `Received status ${response.status}`,
        "Test API with invalid JWT token"
      );

      expect(result.passed).toBe(true);
    } catch (error: any) {
      const status = error.response?.status;
      const result = createTestResult(
        "CSRF/Auth - Request with invalid token",
        "MEDIUM",
        status === 401,
        "Should reject requests with invalid JWT tokens",
        `Received status ${status}`,
        "Test API with invalid JWT token"
      );
      expect(result.passed).toBe(true);
    }
  });
});
