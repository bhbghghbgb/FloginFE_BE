import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { ProductForm } from "../ProductForm";
import { createMockAxiosResponse } from "./Common";

vi.mock("../../services/api");

describe("ProductForm Integration", () => {
  const mockApiClient = apiClient as Mocked<typeof apiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit form with valid data", async () => {
    const onSuccess = vi.fn();
    const mockProductData = {
      id: 1,
      name: "New Product",
      price: 100,
      quantity: 10,
      description: "Test Description",
      category: "Electronics",
      active: true,
    };
    const mockResponse = createMockAxiosResponse(mockProductData);
    mockApiClient.createProduct.mockResolvedValue(mockResponse);

    render(<ProductForm onSuccess={onSuccess} />);

    await userEvent.type(
      screen.getByTestId("product-name-input"),
      "New Product"
    );
    await userEvent.type(screen.getByTestId("product-price-input"), "100");
    await userEvent.type(screen.getByTestId("product-quantity-input"), "10");
    await userEvent.type(
      screen.getByTestId("product-category-input"),
      "Electronics"
    );
    await userEvent.type(
      screen.getByTestId("product-description-input"),
      "Test Description"
    );

    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(mockApiClient.createProduct).toHaveBeenCalledWith({
        name: "New Product",
        price: 100,
        quantity: 10,
        description: "Test Description",
        category: "Electronics",
      });
      expect(onSuccess).toHaveBeenCalledWith(mockProductData);
    });
  });

  it("should display validation errors for invalid data", async () => {
    render(<ProductForm />);

    await userEvent.type(screen.getByTestId("product-name-input"), "ab");
    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(screen.getByTestId("form-errors")).toBeInTheDocument();
      expect(
        screen.getByText(/product name must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("should load product data when editing", async () => {
    const mockProduct = {
      id: 1,
      name: "Existing Product",
      price: 200,
      quantity: 5,
      description: "Existing Description",
      category: "Books",
      active: true,
    };

    const mockResponse = createMockAxiosResponse(mockProduct);
    mockApiClient.getProductById.mockResolvedValue(mockResponse);

    render(<ProductForm productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("product-name-input")).toHaveValue(
        "Existing Product"
      );
      expect(screen.getByTestId("product-price-input")).toHaveValue(200);
      expect(screen.getByTestId("product-category-input")).toHaveValue("Books");
    });
  });
});
