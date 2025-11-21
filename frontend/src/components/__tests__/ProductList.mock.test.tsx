import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { ProductList } from "../ProductList";
import { createMockAxiosResponse } from "./Common";

vi.mock("../../services/api");
const mockApiClient = apiClient as Mocked<typeof apiClient>;

describe("ProductList Mock Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mock product service and verify calls", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Mock Product",
        price: 100,
        quantity: 10,
        description: "Mock Description",
        category: "Electronics",
        active: true,
      },
    ];

    const mockResponse = createMockAxiosResponse({ content: mockProducts });
    mockApiClient.getProducts.mockResolvedValue(mockResponse);

    testWrapperRender(<ProductList />);

    await waitFor(() => {
      expect(mockApiClient.getProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByText("Mock Product")).toBeInTheDocument();
    });
  });

  it("should handle empty product list", async () => {
    const mockResponse = createMockAxiosResponse({ content: [] });
    mockApiClient.getProducts.mockResolvedValue(mockResponse);

    testWrapperRender(<ProductList />);

    await waitFor(() => {
      expect(mockApiClient.getProducts).toHaveBeenCalledTimes(1);
      expect(screen.getByTestId("product-list")).toBeInTheDocument();
    });
  });
});
