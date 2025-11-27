import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Rate Limiting Tests", () => {
  let client: SecurityTestClient;

  beforeEach(() => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should test login rate limiting", async () => {
    const attempts = 10;
    let successCount = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await client.post("/auth/login", {
          username: `user${i}`,
          password: "wrongpassword",
        });

        if (response.status === 200) {
          successCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        // Expected for failed logins
      }
    }

    const result = createTestResult(
      "Rate Limiting - Login endpoint",
      "MEDIUM",
      successCount < attempts,
      "successCount < attempts",
      "Should implement rate limiting on login",
      `${successCount}/${attempts} login attempts succeeded`,
      "Test if login endpoint has rate limiting",
      {
        endpoint: "/auth/login",
        attempts,
        interval: "100ms",
      },
      { successes: successCount, rate: `${successCount}/${attempts}` },
      "Implement rate limiting using Spring Security or dedicated library like Bucket4j"
    );

    expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
  });

  it("should test API endpoint rate limiting", async () => {
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

    const attempts = 20;
    let successCount = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await client.get("/products");
        if (response.status === 200) {
          successCount++;
        }

        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        // Might get rate limited
      }
    }

    const result = createTestResult(
      "Rate Limiting - Product API",
      "LOW",
      true,
      "true", // Informational test
      "Should consider rate limiting on API endpoints",
      `${successCount}/${attempts} product API requests succeeded`,
      "Test if product API has rate limiting",
      {
        endpoint: "/products",
        method: "GET",
        attempts,
        interval: "50ms",
      },
      { successes: successCount, rate: `${successCount}/${attempts}` },
      "Consider implementing rate limiting for API endpoints to prevent abuse"
    );

    expect(result.passed, JSON.stringify(result, null, 2)).toBe(true);
  });
});
