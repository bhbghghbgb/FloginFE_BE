import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { ProductDetail } from "../ProductDetail";
import { createMockAxiosResponse } from "./Common";

vi.mock("../../services/api");

describe("ProductDetail Integration", () => {
  const mockApiClient = apiClient as Mocked<typeof apiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display product details", async () => {
    const mockProduct = {
      id: 1,
      name: "Test Product",
      price: 150,
      quantity: 25,
      description: "A great product",
      category: "Electronics",
      active: true,
    };

    const mockResponse = createMockAxiosResponse(mockProduct);
    mockApiClient.getProductById.mockResolvedValue(mockResponse);

    render(<ProductDetail productId={1} />);

    await waitFor(() => {
      expect(screen.getByTestId("product-detail")).toBeInTheDocument();
      expect(screen.getByTestId("product-name")).toHaveTextContent(
        "Test Product"
      );
      expect(screen.getByTestId("product-price")).toHaveTextContent(
        "Price: $150"
      );
      expect(screen.getByTestId("product-quantity")).toHaveTextContent(
        "Quantity: 25"
      );
      expect(screen.getByTestId("product-category")).toHaveTextContent(
        "Category: Electronics"
      );
    });
  });

  it("should display error for non-existent product", async () => {
    mockApiClient.getProductById.mockRejectedValue({
      response: { data: { message: "Product not found" } },
    });

    render(<ProductDetail productId={999} />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/product not found/i)).toBeInTheDocument();
    });
  });
});
