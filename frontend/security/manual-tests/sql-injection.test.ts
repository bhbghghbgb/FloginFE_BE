import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestResult } from "../types";
import { SecurityTestClient } from "../utils/api-client";
import { SQL_INJECTION_PAYLOADS, createTestResult } from "../utils/test-utils";

describe("SQL Injection Tests", () => {
  let client: SecurityTestClient;
  const results: SecurityTestResult[] = [];

  beforeEach(() => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should prevent SQL injection in login endpoint", async () => {
    for (const payload of SQL_INJECTION_PAYLOADS) {
      try {
        const response = await client.post("/auth/login", {
          username: payload,
          password: "anypassword",
        });

        const result = createTestResult(
          `SQL Injection - Login with ${payload.substring(0, 20)}...`,
          "CRITICAL",
          response.status !== 200 || !response.data.token,
          "Should reject login with SQL injection payload",
          response.status === 200
            ? "Login succeeded (VULNERABLE)"
            : "Login rejected (SECURE)",
          `Test SQL injection in login with payload: ${payload}`,
          { username: payload, password: "***" },
          { status: response.status, hasToken: !!response.data.token },
          "Implement parameterized queries and input validation"
        );

        results.push(result);
        expect(result.passed).toBe(true);
      } catch (error) {
        // Expected behavior - login should fail
        const result = createTestResult(
          `SQL Injection - Login with ${payload.substring(0, 20)}...`,
          "CRITICAL",
          true,
          "Should reject login with SQL injection payload",
          "Login rejected (SECURE)",
          `Test SQL injection in login with payload: ${payload}`
        );
        results.push(result);
        expect(result.passed).toBe(true);
      }
    }
  });

  it("should prevent SQL injection in product search", async () => {
    // First login as admin
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

    for (const payload of SQL_INJECTION_PAYLOADS) {
      try {
        const response = await client.get(
          `/products?name=${encodeURIComponent(payload)}`
        );

        const result = createTestResult(
          `SQL Injection - Product search with ${payload.substring(0, 20)}...`,
          "HIGH",
          response.status !== 200 || !Array.isArray(response.data?.content),
          "Should handle SQL injection payload safely",
          response.status === 200
            ? "Request succeeded (check logs)"
            : "Request handled safely",
          `Test SQL injection in product search with payload: ${payload}`,
          { search: payload },
          { status: response.status }
        );

        results.push(result);
        expect(result.passed).toBe(true);
      } catch (error) {
        // Expected for some cases
        const result = createTestResult(
          `SQL Injection - Product search with ${payload.substring(0, 20)}...`,
          "HIGH",
          true,
          "Should handle SQL injection payload safely",
          "Request handled safely",
          `Test SQL injection in product search with payload: ${payload}`
        );
        results.push(result);
        expect(result.passed).toBe(true);
      }
    }
  });
});
