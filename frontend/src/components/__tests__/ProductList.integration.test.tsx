import { screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import {
  createMockAxiosError,
  createMockAxiosResponse,
} from "../../utils/mock-utils";
import { testWrapperRender } from "../../utils/test-utils";
import { ProductList } from "../ProductList";

// Mock the API client
vi.mock("../../services/api");

describe("ProductList Integration", () => {
  const mockApiClient = apiClient as Mocked<typeof apiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display products", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Test Product",
        price: 100,
        quantity: 10,
        description: "Test Description",
        category: "Electronics",
        active: true,
      },
    ];

    mockApiClient.getProducts.mockResolvedValue(
      createMockAxiosResponse({ content: mockProducts })
    );

    testWrapperRender(<ProductList />);

    await waitFor(() => {
      expect(screen.getByTestId("product-list")).toBeInTheDocument();
      expect(screen.getByTestId("product-1")).toBeInTheDocument();
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("Price: $100")).toBeInTheDocument();
    });
  });

  it("should display error when fetch fails", async () => {
    mockApiClient.getProducts.mockRejectedValue(
      createMockAxiosError("Network error")
    );

    testWrapperRender(<ProductList />);

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toBeInTheDocument();
      expect(screen.getByText(/failed to fetch products/i)).toBeInTheDocument();
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });
  });
});
