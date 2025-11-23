import { expect, Page, test } from "@playwright/test";
import { ProductPage } from "./pages/ProductPage";
import { loginAndSaveState } from "./utils";

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

  test("read/list products", async ({ page }) => {
    await expect(productPage.productList).toBeVisible();

    const productId = await getFirstProductId(page);
    await expect(productPage.getProductItem(productId)).toBeVisible();
  });

  test("update product", async ({ page }) => {
    const productId = await getFirstProductId(page);
    await productPage.clickEditProduct(productId);
    await productPage.fillProductName("Updated Product");
    await productPage.clickSave();

    await expect(productPage.successMessage).toBeVisible();
  });

  test("delete product", async ({ page }) => {
    // Accept window.confirm in the browser
    page.once("dialog", (dialog) => dialog.accept());

    const productId = await getFirstProductId(page);
    await productPage.clickDeleteProduct(productId);

    await expect(page.getByTestId(`product-${productId}`)).toHaveCount(0);
  });

  test("search/filter functionality", async () => {
    await productPage.searchProducts("laptop");
    await productPage.filterByCategory("Electronics");

    await expect(productPage.productList).toBeVisible();
    // Add more assertions based on expected filtered results
  });
});

async function getFirstProductId(page: Page): Promise<number> {
  const firstProductElement = page.getByTestId(/^product-\d+$/).first();

  const attr = await firstProductElement.getAttribute("data-testid");
  if (!attr) throw new Error("No product found");

  return Number(attr.replace("product-", ""));
}
