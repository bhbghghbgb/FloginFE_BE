import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { testWrapperRender } from "../../utils/test-utils";
import { ProductForm } from "../ProductForm";
import { createMockAxiosResponse } from "./Common";

vi.mock("../../services/api");
const mockApiClient = apiClient as Mocked<typeof apiClient>;

describe("ProductForm Mock Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mock CRUD operations for product creation", async () => {
    const mockProductData = {
      id: 1,
      name: "New Product",
      price: 100,
      quantity: 10,
      description: "Test",
      category: "Electronics",
      active: true,
    };
    const mockResponse = createMockAxiosResponse(mockProductData);
    mockApiClient.createProduct.mockResolvedValue(mockResponse);

    testWrapperRender(<ProductForm />);

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

    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(mockApiClient.createProduct).toHaveBeenCalledTimes(1);
      expect(mockApiClient.createProduct).toHaveBeenCalledWith({
        name: "New Product",
        price: 100,
        quantity: 10,
        description: "",
        category: "Electronics",
      });
    });
  });

  it("should mock CRUD operations for product update", async () => {
    const mockProduct = {
      id: 1,
      name: "Existing Product",
      price: 200,
      quantity: 5,
      description: "Existing",
      category: "Books",
      active: true,
    };

    const mockGetResponse = createMockAxiosResponse(mockProduct);
    mockApiClient.getProductById.mockResolvedValue(mockGetResponse);

    const updatedProduct = { ...mockProduct, name: "Updated Product" };
    const mockUpdateResponse = createMockAxiosResponse(updatedProduct);
    mockApiClient.updateProduct.mockResolvedValue(mockUpdateResponse);

    testWrapperRender(<ProductForm productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("product-name-input")).toHaveValue(
        "Existing Product"
      );
    });

    await userEvent.clear(screen.getByTestId("product-name-input"));
    await userEvent.type(
      screen.getByTestId("product-name-input"),
      "Updated Product"
    );
    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(mockApiClient.updateProduct).toHaveBeenCalledTimes(1);
      expect(mockApiClient.updateProduct).toHaveBeenCalledWith(1, {
        name: "Updated Product",
        price: 200,
        quantity: 5,
        description: "Existing",
        category: "Books",
      });
    });
  });

  it("should test failure scenario for product creation", async () => {
    mockApiClient.createProduct.mockRejectedValue({
      response: { data: { message: "Product creation failed" } },
    });

    testWrapperRender(<ProductForm />);

    await userEvent.type(
      screen.getByTestId("product-name-input"),
      "Test Product"
    );
    await userEvent.type(screen.getByTestId("product-price-input"), "100");
    await userEvent.type(
      screen.getByTestId("product-category-input"),
      "Electronics"
    );

    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(screen.getByTestId("form-errors")).toBeInTheDocument();
      expect(screen.getByText(/product creation failed/i)).toBeInTheDocument();
    });
  });

  it("should verify all mock calls with correct parameters", async () => {
    const mockProductData = {
      id: 1,
      name: "Test Product",
      price: 150,
      quantity: 20,
      description: "Test desc",
      category: "Test Category",
      active: true,
    };
    const mockResponse = createMockAxiosResponse(mockProductData);
    mockApiClient.createProduct.mockResolvedValue(mockResponse);

    const onSuccess = vi.fn();
    testWrapperRender(<ProductForm onSuccess={onSuccess} />);

    const productData = {
      name: "Test Product",
      price: "150",
      quantity: "20",
      description: "Test desc",
      category: "Test Category",
    };

    await userEvent.type(
      screen.getByTestId("product-name-input"),
      productData.name
    );
    await userEvent.type(
      screen.getByTestId("product-price-input"),
      productData.price
    );
    await userEvent.type(
      screen.getByTestId("product-quantity-input"),
      productData.quantity
    );
    await userEvent.type(
      screen.getByTestId("product-description-input"),
      productData.description
    );
    await userEvent.type(
      screen.getByTestId("product-category-input"),
      productData.category
    );

    fireEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(mockApiClient.createProduct).toHaveBeenCalledTimes(1);
      expect(mockApiClient.createProduct).toHaveBeenCalledWith({
        name: productData.name,
        price: Number(productData.price),
        quantity: Number(productData.quantity),
        description: productData.description,
        category: productData.category,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockProductData);
    });
  });
});
