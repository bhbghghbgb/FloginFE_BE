import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { testWrapperRender } from "../../utils/test-utils";

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { createMockAxiosResponse } from "../../utils/mock-utils";
import { ProductForm } from "../ProductForm";

// Mock the API client
vi.mock("../../services/api");

describe("ProductForm Integration", () => {
  const mockApiClient = apiClient as Mocked<typeof apiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should submit form with valid data", async () => {
    const mockResponse = {
      id: 1,
      name: "New Product",
      price: 100,
      quantity: 10,
      description: "Test Description",
      category: "Electronics",
    };

    mockApiClient.createProduct.mockResolvedValue(
      createMockAxiosResponse(mockResponse)
    );

    render(
      <MemoryRouter initialEntries={["/products/create"]}>
        <Routes>
          <Route path="/products/create" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    await userEvent.type(
      screen.getByTestId("product-name-input"),
      "New Product"
    );
    await userEvent.type(screen.getByTestId("product-price-input"), "100");
    await userEvent.type(screen.getByTestId("product-quantity-input"), "10");
    await userEvent.selectOptions(
      screen.getByTestId("product-category-input"),
      "Electronics"
    );
    await userEvent.type(
      screen.getByTestId("product-description-input"),
      "Test Description"
    );

    await userEvent.click(screen.getByTestId("submit-product"));

    await waitFor(() => {
      expect(mockApiClient.createProduct).toHaveBeenCalledWith({
        name: "New Product",
        price: 100,
        quantity: 10,
        description: "Test Description",
        category: "Electronics",
      });
    });
  });

  it("should display validation errors for invalid data", async () => {
    testWrapperRender(<ProductForm />);

    await userEvent.type(screen.getByTestId("product-name-input"), "ab");
    await userEvent.click(screen.getByTestId("submit-product"));

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

    mockApiClient.getProductById.mockResolvedValue(
      createMockAxiosResponse(mockProduct)
    );

    render(
      <MemoryRouter initialEntries={["/product/edit/1"]}>
        <Routes>
          <Route path="/product/edit/:id" element={<ProductForm />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("product-name-input")).toHaveValue(
        "Existing Product"
      );
      expect(screen.getByTestId("product-price-input")).toHaveValue(200);
      expect(screen.getByTestId("product-category-input")).toHaveValue("Books");
    });
  });
});
