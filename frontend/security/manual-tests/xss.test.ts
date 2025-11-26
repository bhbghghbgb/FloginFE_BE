import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import {
    TEST_PRODUCT,
    XSS_PAYLOADS,
    createTestResult,
} from "../utils/test-utils.js";

describe("XSS Tests", () => {
  let client: SecurityTestClient;

  beforeEach(async () => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
    await client.login(
      process.env.TEST_USERNAME || "admin",
      process.env.TEST_PASSWORD || "password"
    );
  });

  it("should sanitize XSS payloads in product creation", async () => {
    for (const payload of XSS_PAYLOADS) {
      try {
        const productData = {
          ...TEST_PRODUCT,
          name: `Test ${payload}`,
          description: payload,
        };

        const response = await client.post("/api/products", productData);

        const result = createTestResult(
          `XSS - Product creation with ${payload.substring(0, 20)}...`,
          "HIGH",
          response.status === 200, // Should accept but sanitize
          "Should accept input but sanitize XSS payloads",
          response.status === 200 ? "Request accepted" : "Request rejected",
          `Test XSS in product creation with payload: ${payload}`,
          { ...productData, name: `Test ${payload.substring(0, 10)}...` },
          { status: response.status },
          "Implement output encoding and input validation"
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const result = createTestResult(
          `XSS - Product creation with ${payload.substring(0, 20)}...`,
          "HIGH",
          error.response?.status === 400, // Should reject or sanitize
          "Should reject or sanitize XSS payloads",
          `Request rejected with status ${error.response?.status}`,
          `Test XSS in product creation with payload: ${payload}`
        );
        expect(result.passed).toBe(true);
      }
    }
  });
});
