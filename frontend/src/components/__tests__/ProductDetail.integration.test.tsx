import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { createMockAxiosResponse } from "../../utils/mock-utils";
import { ProductDetail } from "../ProductDetail";

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
    };

    mockApiClient.getProductById.mockResolvedValue(
      createMockAxiosResponse(mockProduct)
    );

    render(
      <MemoryRouter initialEntries={["/products/1"]}>
        <Routes>
          <Route path="/products/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("product-detail")).toBeInTheDocument();
      expect(screen.getByTestId("product-name")).toHaveTextContent(
        "Test Product"
      );
      expect(screen.getByTestId("product-price")).toHaveTextContent("$150");
      expect(screen.getByTestId("product-quantity")).toHaveTextContent("25");
    });
  });
});
