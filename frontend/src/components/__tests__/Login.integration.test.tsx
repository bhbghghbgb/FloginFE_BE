import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { createMockAxiosError } from "../../utils/mock-utils";
import { testWrapperRender } from "../../utils/test-utils";
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
    testWrapperRender(<Login />);

    // Test rendering
    expect(screen.getByTestId("username-input")).toBeInTheDocument();
    expect(screen.getByTestId("password-input")).toBeInTheDocument();
    expect(screen.getByTestId("login-button")).toBeInTheDocument();

    // Test user interactions
    await userEvent.type(screen.getByTestId("username-input"), "testuser");
    await userEvent.type(screen.getByTestId("password-input"), "password123");

    expect(screen.getByTestId("username-input")).toHaveValue("testuser");
    expect(screen.getByTestId("password-input")).toHaveValue("password123");
  });

  it("should handle form submission and API call", async () => {
    const mockLoginResponse = {
      success: true,
      message: "Login successful",
      token: "jwt-token",
    };

    mockApiClient.login.mockResolvedValue(
      createMockAxiosResponse(mockLoginResponse)
    );

    testWrapperRender(<Login />);

    await userEvent.type(screen.getByTestId("username-input"), "testuser");
    await userEvent.type(screen.getByTestId("password-input"), "password123");
    await userEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("should handle API errors and display error messages", async () => {
    mockApiClient.login.mockRejectedValue(
      createMockAxiosError("Login failed", 401)
    );

    testWrapperRender(<Login />);

    await userEvent.type(screen.getByTestId("username-input"), "testuser");
    await userEvent.type(screen.getByTestId("password-input"), "wrongpassword");
    await userEvent.click(screen.getByTestId("login-button"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toBeInTheDocument();
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
