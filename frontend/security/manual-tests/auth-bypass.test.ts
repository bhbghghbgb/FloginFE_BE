import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Authentication Bypass Tests", () => {
  let client: SecurityTestClient;

  beforeEach(() => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should prevent unauthorized role escalation", async () => {
    await client.login("testuser", "Test123");

    const results = [];

    try {
      const response = await client.post("/products", {
        name: "Unauthorized Product",
        price: 100,
        quantity: 1,
        description: "Should not be allowed",
        category: "Test",
      });

      const result = createTestResult(
        "Auth Bypass - User accessing admin endpoint",
        "HIGH",
        response.status === 403,
        "response.status === 403",
        "Should reject unauthorized access to admin endpoints",
        `Received status ${response.status}`,
        "Test if regular user can access admin-only endpoints",
        { method: "POST", url: "/products", role: "user" },
        { status: response.status }
      );

      results.push(result);
    } catch (error: any) {
      const status = error.response?.status;
      const result = createTestResult(
        "Auth Bypass - User accessing admin endpoint",
        "HIGH",
        status === 403,
        "status === 403",
        "Should reject unauthorized access to admin endpoints",
        `Received status ${status}`,
        "Test if regular user can access admin-only endpoints",
        { method: "POST", url: "/products", role: "user" },
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

  it("should test common authentication bypass techniques", async () => {
    const bypassAttempts = [
      { username: "admin", password: "" },
      { username: "", password: "password" },
      { username: "admin", password: "wrongpassword" },
      { username: "' OR '1'='1' --", password: "anything" },
      { username: "admin", password: "password' OR '1'='1" },
    ];

    const results = [];

    for (const attempt of bypassAttempts) {
      try {
        const response = await client.post("/auth/login", attempt);

        const result = createTestResult(
          `Auth Bypass - Login with ${attempt.username.substring(0, 10)}...`,
          "CRITICAL",
          response.status !== 200 || !response.data.token,
          "response.status !== 200 || !response.data.token",
          "Should reject invalid login attempts",
          response.status === 200
            ? "Login succeeded (VULNERABLE)"
            : "Login rejected (SECURE)",
          `Test authentication bypass with credentials: ${JSON.stringify(
            attempt
          )}`,
          { endpoint: "/auth/login", credentials: attempt },
          { status: response.status, hasToken: !!response.data.token },
          "Implement strong authentication with parameterized queries and input validation"
        );

        results.push(result);
      } catch (error: any) {
        const result = createTestResult(
          `Auth Bypass - Login with ${attempt.username.substring(0, 10)}...`,
          "CRITICAL",
          true,
          "true", // Exception means login was rejected
          "Should reject invalid login attempts",
          "Login rejected (SECURE)",
          `Test authentication bypass with credentials: ${JSON.stringify(
            attempt
          )}`,
          { endpoint: "/auth/login", credentials: attempt }
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
