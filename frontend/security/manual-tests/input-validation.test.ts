import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Input Validation Tests", () => {
  let client: SecurityTestClient;

  beforeEach(async () => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  });

  it("should validate product name constraints", async () => {
    const invalidNames = [
      "", // empty
      "ab", // too short (min 3)
      "a".repeat(101), // too long (max 100)
      "   ", // whitespace only
      null, // null value
    ];

    for (const name of invalidNames) {
      try {
        const response = await client.post("/products", {
          name,
          price: 1000,
          quantity: 10,
          description: "Test description",
          category: "Test",
        });

        const result = createTestResult(
          `Input Validation - Product name "${
            name?.substring(0, 10) || "null"
          }"`,
          "MEDIUM",
          response.status === 400,
          "Should reject invalid product names",
          `Received status ${response.status}`,
          `Test product name validation: ${name}`
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `Input Validation - Product name "${
            name?.substring(0, 10) || "null"
          }"`,
          "MEDIUM",
          status === 400,
          "Should reject invalid product names",
          `Received status ${status}`,
          `Test product name validation: ${name}`
        );
        expect(result.passed).toBe(true);
      }
    }
  });

  it("should validate price constraints", async () => {
    const invalidPrices = [
      0, // below min
      -100, // negative
      1000000000, // above max
      1.5, // decimal (if not allowed)
      null,
      "string" as any,
    ];

    for (const price of invalidPrices) {
      try {
        const response = await client.post("/products", {
          name: "Test Product",
          price,
          quantity: 10,
          description: "Test description",
          category: "Test",
        });

        const result = createTestResult(
          `Input Validation - Price ${price}`,
          "MEDIUM",
          response.status === 400,
          "Should reject invalid prices",
          `Received status ${response.status}`,
          `Test price validation: ${price}`
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `Input Validation - Price ${price}`,
          "MEDIUM",
          status === 400,
          "Should reject invalid prices",
          `Received status ${status}`,
          `Test price validation: ${price}`
        );
        expect(result.passed).toBe(true);
      }
    }
  });

  it("should validate quantity constraints", async () => {
    const invalidQuantities = [
      -1, // below min
      100000, // above max
      null,
      "invalid" as any,
    ];

    for (const quantity of invalidQuantities) {
      try {
        const response = await client.post("/products", {
          name: "Test Product",
          price: 1000,
          quantity,
          description: "Test description",
          category: "Test",
        });

        const result = createTestResult(
          `Input Validation - Quantity ${quantity}`,
          "MEDIUM",
          response.status === 400,
          "Should reject invalid quantities",
          `Received status ${response.status}`,
          `Test quantity validation: ${quantity}`
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `Input Validation - Quantity ${quantity}`,
          "MEDIUM",
          status === 400,
          "Should reject invalid quantities",
          `Received status ${status}`,
          `Test quantity validation: ${quantity}`
        );
        expect(result.passed).toBe(true);
      }
    }
  });

  it("should validate description length", async () => {
    const longDescription = "a".repeat(501); // max 500

    try {
      const response = await client.post("/products", {
        name: "Test Product",
        price: 1000,
        quantity: 10,
        description: longDescription,
        category: "Test",
      });

      const result = createTestResult(
        "Input Validation - Description too long",
        "LOW",
        response.status === 400,
        "Should reject overly long descriptions",
        `Received status ${response.status}`,
        "Test description length validation"
      );

      expect(result.passed).toBe(true);
    } catch (error: any) {
      const status = error.response?.status;
      const result = createTestResult(
        "Input Validation - Description too long",
        "LOW",
        status === 400,
        "Should reject overly long descriptions",
        `Received status ${status}`,
        "Test description length validation"
      );
      expect(result.passed).toBe(true);
    }
  });

  it("should validate login request format", async () => {
    const invalidLogins = [
      {}, // empty object
      { username: "" }, // missing password
      { password: "test" }, // missing username
      { username: null, password: null }, // null values
      { username: "a".repeat(51), password: "test" }, // username too long
    ];

    for (const login of invalidLogins) {
      try {
        const response = await client.post("/auth/login", login);

        const result = createTestResult(
          `Input Validation - Invalid login format`,
          "MEDIUM",
          response.status === 400,
          "Should reject malformed login requests",
          `Received status ${response.status}`,
          `Test login validation: ${JSON.stringify(login)}`
        );

        expect(result.passed).toBe(true);
      } catch (error: any) {
        const status = error.response?.status;
        const result = createTestResult(
          `Input Validation - Invalid login format`,
          "MEDIUM",
          status === 400,
          "Should reject malformed login requests",
          `Received status ${status}`,
          `Test login validation: ${JSON.stringify(login)}`
        );
        expect(result.passed).toBe(true);
      }
    }
  });
});
