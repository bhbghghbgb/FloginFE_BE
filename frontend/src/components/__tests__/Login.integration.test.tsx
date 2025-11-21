import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { Login } from "../Login";
import { createMockAxiosResponse } from "./Common";

// Mock the API client
vi.mock("../../services/api");

describe("Login Component Integration", () => {
  const mockApiClient = apiClient as Mocked<typeof apiClient>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render login form and handle user interactions", async () => {
    render(<Login />);

    // Test rendering
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();

    // Test user interactions
    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    expect(screen.getByLabelText(/username/i)).toHaveValue("testuser");
    expect(screen.getByLabelText(/password/i)).toHaveValue("password123");
  });

  it("should handle form submission and API call", async () => {
    const mockLoginData = {
      success: true,
      message: "Login successful",
      token: "jwt-token",
    };
    const mockLoginResponse = createMockAxiosResponse(mockLoginData);
    mockApiClient.login.mockResolvedValue(mockLoginResponse);

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("should handle generic API errors and display fallback message", async () => {
    const validUsername = "testuser";
    const validPassword = "TestPass123";

    // 2. Mock the rejection with a standard Error object (no 'response' property)
    mockApiClient.login.mockRejectedValue(new Error("Network Error"));

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), validUsername);
    await userEvent.type(screen.getByLabelText(/password/i), validPassword);
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledTimes(1);

      expect(screen.getByText("Login failed")).toBeInTheDocument();
    });
  });
});
