import type { AxiosResponse, AxiosResponseHeaders } from "axios";

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
