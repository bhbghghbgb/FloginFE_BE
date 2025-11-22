import { expect } from "@playwright/test";
import { ProductPage } from "./pages/ProductPage";
import { loginAndSaveState, test } from "./utils";

test.describe("Product E2E Tests", () => {
  let productPage: ProductPage;

  test.beforeEach(async ({ page }) => {
    // 1. Login before running any product test
    await loginAndSaveState(page);

    // 2. Navigate to products after login
    productPage = new ProductPage(page);
    await page.goto("/products");
  });

  test("create product flow", async () => {
    await productPage.clickCreateProduct();
    await productPage.fillProductName("New Product");
    await productPage.fillPrice("100");
    await productPage.fillQuantity("10");
    await productPage.fillCategory("Electronics");
    await productPage.fillDescription("Test Description");
    await productPage.clickSave();

    await expect(productPage.successMessage).toBeVisible();
  });

  test("read/list products", async () => {
    await expect(productPage.productList).toBeVisible();
    await expect(productPage.getProductItem(1)).toBeVisible();
  });

  test("update product", async () => {
    await productPage.clickEditProduct(1);
    await productPage.fillProductName("Updated Product");
    await productPage.clickSave();

    await expect(productPage.successMessage).toBeVisible();
  });

  test("delete product", async () => {
    await productPage.clickDeleteProduct(1);
    await productPage.confirmDelete();

    await expect(productPage.successMessage).toBeVisible();
  });

  test("search/filter functionality", async () => {
    await productPage.searchProducts("laptop");
    await productPage.filterByCategory("Electronics");

    await expect(productPage.productList).toBeVisible();
    // Add more assertions based on expected filtered results
  });
});
