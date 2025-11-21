import { test, expect } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";

test.describe("Login E2E Tests", () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test("complete login flow", async ({ page }) => {
    // Test successful login
    await loginPage.login("validuser", "validpass123");

    // Verify successful login redirect or message
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("validation messages", async () => {
    // Test empty submission
    await loginPage.clickLogin();
    await expect(loginPage.usernameError).toHaveText("Username is required");
    await expect(loginPage.passwordError).toHaveText("Password is required");

    // Test invalid username
    await loginPage.fillUsername("ab");
    await loginPage.clickLogin();
    await expect(loginPage.usernameError).toHaveText(/at least 3 characters/);
  });

  test("error flows", async () => {
    // Test invalid credentials
    await loginPage.login("wronguser", "wrongpass");
    await expect(loginPage.errorMessage).toHaveText(/invalid credentials/i);
  });

  test("UI elements interactions", async () => {
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
