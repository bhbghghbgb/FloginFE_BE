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
