import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Login E2E Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("complete login flow", async ({ page }) => {
    // Mock successful login response
    await page.route("**/api/auth/login", async (route) => {
      const json = {
        success: true,
        message: "Login successful",
        token: "jwt-token",
      };
      await route.fulfill({ json });
    });

    await loginPage.login("validuser", "validpass123");

    // Verify successful login redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator("text=Welcome to your dashboard")).toBeVisible();
  });

  test("validation messages", async ({ page }) => {
    // Test empty submission
    await loginPage.clickLogin();
    await expect(loginPage.usernameError).toHaveText("Username is required");
    await expect(loginPage.passwordError).toHaveText("Password is required");

    // Test invalid username
    await loginPage.fillUsername("ab");
    await loginPage.clickLogin();
    await expect(loginPage.usernameError).toHaveText(/at least 3 characters/);
  });

  test("error flows", async ({ page }) => {
    // Mock failed login response
    await page.route("**/api/auth/login", async (route) => {
      const json = {
        success: false,
        message: "Invalid credentials",
      };
      await route.fulfill({ status: 401, json });
    });

    await loginPage.login("wronguser", "wrongpass");
    await expect(loginPage.errorMessage).toHaveText(/invalid credentials/i);
  });

  test("UI elements interactions", async ({ page }) => {
    // Test all UI elements are interactive
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();

    // Test input interactions
    await loginPage.usernameInput.fill("testuser");
    await loginPage.passwordInput.fill("testpass");

    await expect(loginPage.usernameInput).toHaveValue("testuser");
    await expect(loginPage.passwordInput).toHaveValue("testpass");
  });
});
