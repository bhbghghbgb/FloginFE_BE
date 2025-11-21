import axios, { type AxiosInstance, type AxiosResponse } from "axios";

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

export interface ProductRequest {
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
}

export interface ProductResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  category: string;
  active: boolean;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = "http://localhost:8080/api") {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config: any) => {
        const token = localStorage.getItem("authToken");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth methods
  async login(
    credentials: LoginRequest
  ): Promise<AxiosResponse<LoginResponse>> {
    return this.client.post<LoginResponse>("/auth/login", credentials);
  }

  // Product methods
  async getProducts(params?: {
    name?: string;
    category?: string;
    page?: number;
    size?: number;
  }): Promise<AxiosResponse<{ content: ProductResponse[] }>> {
    return this.client.get("/products", { params });
  }

  async getProductById(id: number): Promise<AxiosResponse<ProductResponse>> {
    return this.client.get(`/products/${id}`);
  }

  async createProduct(
    product: ProductRequest
  ): Promise<AxiosResponse<ProductResponse>> {
    return this.client.post("/products", product);
  }

  async updateProduct(
    id: number,
    product: ProductRequest
  ): Promise<AxiosResponse<ProductResponse>> {
    return this.client.put(`/products/${id}`, product);
  }

  async deleteProduct(id: number): Promise<AxiosResponse<void>> {
    return this.client.delete(`/products/${id}`);
  }
}

export const apiClient = new ApiClient();
