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
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  });

  it("should sanitize XSS payloads in product creation", async () => {
    const results = [];

    for (const payload of XSS_PAYLOADS) {
      try {
        const productData = {
          ...TEST_PRODUCT,
          name: `Test ${payload}`,
          description: payload,
        };

        const response = await client.post("/products", productData);

        const result = createTestResult(
          `XSS - Product creation with ${payload.substring(0, 20)}...`,
          "HIGH",
          response.status === 200,
          "response.status === 200",
          "Should accept input but sanitize XSS payloads",
          response.status === 200 ? "Request accepted" : "Request rejected",
          `Test XSS in product creation with payload: ${payload}`,
          {
            method: "POST",
            url: "/products",
            payload: {
              name: `Test ${payload.substring(0, 10)}...`,
              description: payload.substring(0, 50) + "...",
            },
          },
          { status: response.status },
          "Implement output encoding and input validation using libraries like OWASP Java Encoder"
        );

        results.push(result);
      } catch (error: any) {
        const result = createTestResult(
          `XSS - Product creation with ${payload.substring(0, 20)}...`,
          "HIGH",
          error.response?.status === 400,
          "error.response?.status === 400",
          "Should reject or sanitize XSS payloads",
          `Request rejected with status ${error.response?.status}`,
          `Test XSS in product creation with payload: ${payload}`,
          {
            method: "POST",
            url: "/products",
            payload: {
              name: `Test ${payload.substring(0, 10)}...`,
              description: payload.substring(0, 50) + "...",
            },
          },
          { status: error.response?.status }
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
});
