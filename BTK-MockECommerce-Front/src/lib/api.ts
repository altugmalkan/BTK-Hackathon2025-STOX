import { API_BASE_URL } from "@/env.client";

/**
 * HTTP API Client for MockECommerce
 * Centralizes all API requests with proper error handling
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Types matching the API documentation
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponse {
  isAuthenticated: boolean;
  token?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  message: string;
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: 0 | 1 | 2; // Draft | Active | Blocked
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  images: ProductImage[];
}

export interface Category {
  id: string;
  parentId: string | null;
  categoryName: string;
  isActive: boolean;
  seoSlug: string;
  children: Category[] | null;
}

export interface UserRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface SellerRegistration {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  storeName: string;
  logoUrl?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateProductRequest {
  categoryId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  status: 0 | 1 | 2;
  images: {
    imageUrl: string;
    altText: string;
    isPrimary: boolean;
    displayOrder: number;
  }[];
}

export interface TokenTestResponse {
  isAuthenticated: boolean;
  userName: string;
  claims: Array<{
    type: string;
    value: string;
  }>;
  roles: string[];
  isAdmin: boolean;
  userId: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
  image?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
  title: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: string;
  message?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/**
 * Generic API client with error handling and authentication
 */
class ApiClient {
  private baseURL: string;
  private authToken: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
    // Try to get token from localStorage on initialization
    this.authToken = localStorage.getItem("auth_token");
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount: number = 0
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    try {
      const response = await fetch(url, {
        headers,
        ...options,
      });

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401 && this.authToken && retryCount === 0) {
        // Clear the invalid token
        this.setAuthToken(null);
        
        // Dispatch custom event for auth failure
        window.dispatchEvent(new CustomEvent('auth:token-expired'));
        
        throw new ApiError(
          "Authentication failed. Please log in again.",
          401,
          "Unauthorized"
        );
      }

      if (!response.ok) {
      let errorMessage = `API request failed: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            url,
            errorData
          });
        }
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If we can't parse the error response, use the default message
        if (process.env.NODE_ENV === 'development') {
          console.error('API Error (no JSON):', {
            status: response.status,
            statusText: response.statusText,
            url
          });
        }
      }
      
      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText
      );
    }

      const data = await response.json();
      if (process.env.NODE_ENV === 'development') {
        console.log('API Success Response:', {
          status: response.status,
          statusText: response.statusText,
          url,
          data
        });
      }
      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      throw new ApiError(
        `Network error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
        0,
        "Network Error"
      );
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data !== undefined ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// API endpoints matching your documentation
export const endpoints = {
  auth: "/auth",
  category: "/category",
  product: "/product",
  apikeys: "/apikeys",
  external: "/external",
  cart: "/cart",
  order: "/order",
  payment: "/payment",
  review: "/review",
} as const;

// Convenience functions for common operations
export const api = {
  // Authentication
  login: (credentials: LoginCredentials): Promise<AuthResponse> =>
    apiClient.post(`${endpoints.auth}/login`, credentials),

  registerUser: (userData: UserRegistration): Promise<AuthResponse> =>
    apiClient.post(`${endpoints.auth}/register`, userData),

  registerSeller: (sellerData: SellerRegistration): Promise<AuthResponse> =>
    apiClient.post(`${endpoints.auth}/register-seller`, sellerData),

  testToken: (): Promise<TokenTestResponse> =>
    apiClient.get(`${endpoints.auth}/test-token`),

  // Categories
  getCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get(endpoints.category),

  getHierarchicalCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get(`${endpoints.category}/hierarchical`),

  getRootCategories: (): Promise<ApiResponse<Category[]>> =>
    apiClient.get(`${endpoints.category}/root`),

  getCategoryById: (id: string): Promise<ApiResponse<Category>> =>
    apiClient.get(`${endpoints.category}/${id}`),

  // Products
  getActiveProducts: (): Promise<ApiResponse<Product[]>> =>
    apiClient.get(`${endpoints.product}/active`),

  getProductById: (id: string): Promise<ApiResponse<Product>> =>
    apiClient.get(`${endpoints.product}/${id}`),

  getProductsByCategory: (
    categoryId: string
  ): Promise<ApiResponse<Product[]>> =>
    apiClient.get(`${endpoints.product}/category/${categoryId}`),

  searchProducts: (searchTerm: string): Promise<ApiResponse<Product[]>> =>
    apiClient.get(
      `${endpoints.product}/search?searchTerm=${encodeURIComponent(searchTerm)}`
    ),

  getProductsByPriceRange: (
    minPrice: number,
    maxPrice: number
  ): Promise<ApiResponse<Product[]>> =>
    apiClient.get(
      `${endpoints.product}/price-range?minPrice=${minPrice}&maxPrice=${maxPrice}`
    ),

  getMyProducts: (): Promise<ApiResponse<Product[]>> =>
    apiClient.get(`${endpoints.product}/my-products`),

  createProduct: (
    productData: CreateProductRequest
  ): Promise<ApiResponse<Product>> =>
    apiClient.post(endpoints.product, productData),

  updateProductStatus: (
    productId: string,
    status: 0 | 1 | 2
  ): Promise<ApiResponse<Product>> =>
    apiClient.patch(`${endpoints.product}/${productId}/status`, status),

  // Cart
  getCart: (): Promise<ApiResponse<CartItem[]>> =>
    apiClient.get(endpoints.cart),

  addToCart: (item: CartItem): Promise<ApiResponse<CartItem>> =>
    apiClient.post(endpoints.cart, item),

  updateCartItem: (productId: string, quantity: number): Promise<ApiResponse<CartItem>> =>
    apiClient.put(`${endpoints.cart}/${productId}`, { quantity }),

  removeFromCart: (productId: string): Promise<ApiResponse<void>> =>
    apiClient.delete(`${endpoints.cart}/${productId}`),

  clearCart: (): Promise<ApiResponse<void>> =>
    apiClient.delete(endpoints.cart),

  // Orders
  getOrders: (): Promise<ApiResponse<Order[]>> =>
    apiClient.get(endpoints.order),

  getOrderById: (orderId: string): Promise<ApiResponse<Order>> =>
    apiClient.get(`${endpoints.order}/${orderId}`),

  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> =>
    apiClient.post(endpoints.order, orderData),

  // Payments
  processPayment: (paymentData: PaymentRequest): Promise<ApiResponse<PaymentResponse>> =>
    apiClient.post(endpoints.payment, paymentData),

  // Reviews
  getReviewsByProduct: (productId: string): Promise<ApiResponse<Review[]>> =>
    apiClient.get(`${endpoints.review}/product/${productId}`),

  addReview: (reviewData: Omit<Review, 'id' | 'createdAt'>): Promise<ApiResponse<Review>> =>
    apiClient.post(endpoints.review, reviewData),

  // Utility methods
  setAuthToken: (token: string | null) => apiClient.setAuthToken(token),
  getAuthToken: () => apiClient.getAuthToken(),
};
