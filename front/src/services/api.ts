const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5246/api";

// Types matching backend
export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  image?: string;
  category?: string;
}

export interface ApiOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

export interface ApiOrder {
  paymentTime: string;
  id: number;
  createdAt: string;
  totalAmount: number;
  items: ApiOrderItem[];
}

export interface CreateOrderRequest {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      console.log(`API Request: ${options?.method || "GET"} ${url}`);
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`API Error: ${response.status} - ${error}`);
        throw new Error(error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Response from ${url}:`, data);
      return data;
    } catch (err) {
      console.error(`API Request failed for ${url}:`, err);
      throw err;
    }
  }

  async getProducts(): Promise<ApiProduct[]> {
    return this.request<ApiProduct[]>("/products");
  }

  async getOrders(): Promise<ApiOrder[]> {
    const result = await this.request<ApiOrder[] | null>("/orders");
    return result || [];
  }

  async getOrderById(id: number): Promise<ApiOrder> {
    return this.request<ApiOrder>(`/orders/${id}`);
  }

  async createOrder(request: CreateOrderRequest): Promise<ApiOrder> {
    return this.request<ApiOrder>("/orders", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }
}

export const apiService = new ApiService(API_BASE_URL);

