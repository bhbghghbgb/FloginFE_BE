import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { apiClient } from "../../services/api";
import { Login } from "../Login";

// Mock the API client
jest.mock("../../services/api");

describe("Login Component Integration", () => {
  const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

  beforeEach(() => {
    jest.clearAllMocks();
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
    const mockLoginResponse = {
      data: { success: true, message: "Login successful", token: "jwt-token" },
      status: 200,
      statusText: "OK",
    };
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

  it("should handle API errors and display error messages", async () => {
    mockApiClient.login.mockRejectedValue(new Error("Login failed"));

    render(<Login />);

    await userEvent.type(screen.getByLabelText(/username/i), "testuser");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/login failed/i)).toBeInTheDocument();
    });
  });
});
