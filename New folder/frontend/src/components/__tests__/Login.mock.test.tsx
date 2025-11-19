import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../services/api";
import { Login } from "../Login";

// Mock the API client
jest.mock("../../services/api");
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("Login Mock Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should mock authService.loginUser with successful response", async () => {
    const mockResponse = {
      data: { success: true, message: "Login successful", token: "jwt-token" },
      status: 200,
      statusText: "OK",
    };
    mockApiClient.login.mockResolvedValue(mockResponse);

    render(<Login />);

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
    mockApiClient.login.mockRejectedValue({
      response: { data: { message: "Invalid credentials" } },
    });

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), "wronguser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpass");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockApiClient.login).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  it("should verify mock calls and their parameters", async () => {
    const mockResponse = {
      data: { success: true, message: "Login successful", token: "jwt-token" },
      status: 200,
      statusText: "OK",
    };
    mockApiClient.login.mockResolvedValue(mockResponse);

    render(<Login />);

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
