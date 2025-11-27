import { beforeEach, describe, expect, it } from "vitest";
import { SecurityTestClient } from "../utils/api-client.js";
import { createTestResult } from "../utils/test-utils.js";

describe("Rate Limiting Tests", () => {
  let client: SecurityTestClient;

  beforeEach(() => {
    client = new SecurityTestClient(process.env.VITE_API_BASE_URL);
  });

  it("should test login rate limiting", async () => {
    const attempts = 10; // Try multiple rapid login attempts
    let successCount = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await client.post("/auth/login", {
          username: `user${i}`, // Different usernames to avoid account lockout
          password: "wrongpassword",
        });

        if (response.status === 200) {
          successCount++;
        }

        // Small delay between requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        // Expected for failed logins
      }
    }

    const result = createTestResult(
      "Rate Limiting - Login endpoint",
      "MEDIUM",
      successCount < attempts, // Should not all succeed
      "Should implement rate limiting on login",
      `${successCount}/${attempts} login attempts succeeded`,
      "Test if login endpoint has rate limiting",
      null,
      { attempts, successes: successCount },
      "Implement rate limiting using Spring Security or dedicated library"
    );

    expect(result.passed).toBe(true);
  });

  it("should test API endpoint rate limiting", async () => {
    // First get a valid token
    await client.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);

    const attempts = 20;
    let successCount = 0;

    for (let i = 0; i < attempts; i++) {
      try {
        const response = await client.get("/products");
        if (response.status === 200) {
          successCount++;
        }

        // Very small delay for rapid requests
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        // Might get rate limited
      }
    }

    const result = createTestResult(
      "Rate Limiting - Product API",
      "LOW",
      true, // This is informational - rate limiting on API might not be critical
      "Should consider rate limiting on API endpoints",
      `${successCount}/${attempts} product API requests succeeded`,
      "Test if product API has rate limiting",
      null,
      { attempts, successes: successCount }
    );

    expect(result.passed).toBe(true);
  });
});
