import type { AxiosResponse, AxiosResponseHeaders } from "axios";
import { useNavigate } from "react-router-dom";
import { vi } from "vitest";

// Generic mock response creator that works with any data type
export const createMockAxiosResponse = <T,>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: "OK",
  headers: {} as AxiosResponseHeaders,
  config: {
    headers: {} as AxiosResponseHeaders,
  } as any,
});

// Mock for error responses
export const createMockAxiosError = (message: string, status: number = 400) => {
  const error = new Error(message) as any;
  error.response = {
    data: { message },
    status,
    statusText: "Error",
  };
  return error;
};

// Mock useParams for Vitest
export const mockUseParams = (params: Record<string, string>) => {
  vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
      ...(actual as any),
      useParams: () => params,
    };
  });
};

// Mock useNavigate for Vitest
export const mockUseNavigate = () => {
  const mockNavigate = vi.fn();
  vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  return mockNavigate;
};
