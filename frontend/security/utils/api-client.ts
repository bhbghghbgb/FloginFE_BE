import axios, { AxiosInstance, AxiosResponse } from "axios";

export interface SecurityTestResult {
  testName: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  passed: boolean;
  description: string;
  request?: any;
  response?: any;
  expected: string;
  actual: string;
  recommendation?: string;
}

export class SecurityTestClient {
  private client: AxiosInstance;
  private authToken: string | null = null;

  constructor(baseURL: string = "http://localhost:8080/api") {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async login(username: string, password: string): Promise<string> {
    try {
      const response: AxiosResponse = await this.client.post(
        "/api/auth/login",
        {
          username,
          password,
        }
      );

      if (response.data.token) {
        this.authToken = response.data.token;
        return response.data.token;
      }
      throw new Error("No token received");
    } catch (error: any) {
      throw new Error(
        `Login failed: ${error.response?.data?.message || error.message}`
      );
    }
  }

  private getHeaders(additionalHeaders: Record<string, string> = {}) {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...additionalHeaders,
    };

    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  async get(url: string, headers: Record<string, string> = {}) {
    return this.client.get(url, {
      headers: this.getHeaders(headers),
    });
  }

  async post(url: string, data: any, headers: Record<string, string> = {}) {
    return this.client.post(url, data, {
      headers: this.getHeaders(headers),
    });
  }

  async put(url: string, data: any, headers: Record<string, string> = {}) {
    return this.client.put(url, data, {
      headers: this.getHeaders(headers),
    });
  }

  async delete(url: string, headers: Record<string, string> = {}) {
    return this.client.delete(url, {
      headers: this.getHeaders(headers),
    });
  }

  async request(
    method: string,
    url: string,
    data?: any,
    headers: Record<string, string> = {}
  ) {
    return this.client.request({
      method,
      url,
      data,
      headers: this.getHeaders(headers),
    });
  }

  clearAuth() {
    this.authToken = null;
  }

  setToken(token: string) {
    this.authToken = token;
  }
}
