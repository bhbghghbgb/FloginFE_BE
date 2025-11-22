import { Page, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

// Function to perform login and save authentication state
export async function loginAndSaveState(page: Page) {
  // Check if the page is already logged in (optional optimization)
  if (page.url().includes("/dashboard") || page.url().includes("/products")) {
    return;
  }

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("testuser", "Test123");

  await expect(page).toHaveURL(/.*\/dashboard/); // The state is implicitly saved by Playwright for the current context.
}

import { test as base } from "@playwright/test";

/**
 * Utility class to manage test environment state (e.g., clearing the database).
 */
export class TestUtils {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Calls the protected backend endpoint to wipe the database.
   * This ensures a clean state before an E2E test suite runs.
   */
  async resetDatabase() {
    console.log(
      `[E2E] Calling backend reset API at ${this.baseUrl}/api/test-utils/reset-db`
    );
    try {
      // Note: We use fetch here to avoid needing a full Playwright page context.
      const response = await fetch(`${this.baseUrl}/api/test-utils/reset-db`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to reset database: ${response.status} ${response.statusText}. Response: ${errorText}`
        );
      }
      console.log("[E2E] Database reset confirmed.");
    } catch (error) {
      console.error("[E2E] Error calling database reset API:", error);
      // Fail fast if we can't ensure a clean state
      throw new Error(
        "Critical: Could not connect to or reset backend database before tests."
      );
    }
  }
}

// Update your Playwright global setup to use this reset utility
export const test = base.extend<{ testUtils: TestUtils }>({
  testUtils: async ({}, use) => {
    // The base URL for the backend is running at http://localhost:8080
    // when using docker-compose
    const testUtils = new TestUtils("http://localhost:8080");
    await use(testUtils);
  },
});
