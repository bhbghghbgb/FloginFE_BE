import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi, type Mocked } from "vitest";
import { apiClient } from "../../services/api";
import { testWrapperRender } from "../../utils/test-utils";
import { Login } from "../Login";
import { createMockAxiosResponse } from "./Common";

// Mock the API client
vi.mock("../../services/api");
const mockApiClient = apiClient as Mocked<typeof apiClient>;

describe("Login Mock Testing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should mock authService.loginUser with successful response", async () => {
    const mockLoginData = {
      success: true,
      message: "Login successful",
      token: "jwt-token",
    };
    const mockResponse = createMockAxiosResponse(mockLoginData);
    mockApiClient.login.mockResolvedValue(mockResponse);

    testWrapperRender(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledTimes(1);
      expect(mockApiClient.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "password123",
      });
    });
  });

  it("should mock authService.loginUser with failed response", async () => {
    const validUsername = "testuser";
    const validPassword = "TestPass123";

    mockApiClient.login.mockRejectedValue({
      response: { data: { message: "Invalid credentials from server" } },
    });

    testWrapperRender(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), validUsername);
    await userEvent.type(screen.getByLabelText(/password/i), validPassword);
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledTimes(1);
      expect(
        screen.getByText(/Invalid credentials from server/i)
      ).toBeInTheDocument();
    });
  });

  it("should verify mock calls and their parameters", async () => {
    const mockLoginData = {
      success: true,
      message: "Login successful",
      token: "jwt-token",
    };
    const mockResponse = createMockAxiosResponse(mockLoginData);
    mockApiClient.login.mockResolvedValue(mockResponse);

    testWrapperRender(<Login />);

    const username = "testuser";
    const password = "testpass123";

    await userEvent.type(screen.getByLabelText(/username/i), username);
    await userEvent.type(screen.getByLabelText(/password/i), password);
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledWith({ username, password });
      expect(mockApiClient.login).toHaveBeenCalledTimes(1);
    });
  });
});
