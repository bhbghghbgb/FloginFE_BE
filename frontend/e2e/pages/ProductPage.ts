import { Locator, Page } from '@playwright/test';

export class ProductPage {
  readonly page: Page;
  readonly createProductButton: Locator;
  readonly productList: Locator;
  readonly productNameInput: Locator;
  readonly priceInput: Locator;
  readonly quantityInput: Locator;
  readonly categoryInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly searchInput: Locator;
  readonly categoryFilter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createProductButton = page.getByTestId('create-product');
    this.productList = page.getByTestId('product-list');
    this.productNameInput = page.getByTestId('product-name-input');
    this.priceInput = page.getByTestId('product-price-input');
    this.quantityInput = page.getByTestId('product-quantity-input');
    this.categoryInput = page.getByTestId('product-category-input');
    this.descriptionInput = page.getByTestId('product-description-input');
    this.saveButton = page.getByTestId('submit-product');
    this.successMessage = page.locator('[data-testid="success-message"]');
    this.searchInput = page.getByTestId('search-input');
    this.categoryFilter = page.getByTestId('category-filter');
  }

  async clickCreateProduct() {
    await this.createProductButton.click();
  }

  async fillProductName(name: string) {
    await this.productNameInput.fill(name);
  }

  async fillPrice(price: string) {
    await this.priceInput.fill(price);
  }

  async fillQuantity(quantity: string) {
    await this.quantityInput.fill(quantity);
  }

  async fillCategory(category: string) {
    await this.categoryInput.selectOption(category);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async clickSave() {
    await this.saveButton.click();
  }

  async clickEditProduct(productId: number) {
    await this.page.getByTestId(`edit-product-${productId}`).click();
  }

  async clickDeleteProduct(productId: number) {
    await this.page.getByTestId(`delete-product-${productId}`).click();
  }

  async confirmDelete() {
    await this.page.getByTestId('confirm-delete').click();
  }

  async searchProducts(query: string) {
    await this.searchInput.fill(query);
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  getProductItem(productId: number) {
    return this.page.getByTestId(`product-${productId}`);
  }
}