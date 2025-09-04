import { LoginCredentials } from "@/modules/auth/domain/entities";
import { httpManager } from "../lib/httpManager";
import {
  Product,
  CreateProduct,
  UpdateProduct,
  ProductFilters,
} from "@/modules/product/domain/entities/product.interface";

/**
 * API utility functions that integrate HttpManager with auth store
 */
export class ApiService {
  private static instance: ApiService;

  private constructor() {
    // Remove auth integration setup to avoid circular dependency
    // this.setupAuthIntegration();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  /**
   * Setup integration between HttpManager and auth store
   * This will be called from the auth store instead to avoid circular dependency
   */
  public setupAuthIntegration(authStore: {
    subscribe: (
      callback: (
        state: { user?: { token?: string } },
        prevState: { user?: { token?: string } }
      ) => void
    ) => void;
  }): void {
    // Subscribe to auth store changes to automatically set/remove token
    authStore.subscribe(
      (
        state: { user?: { token?: string } },
        prevState: { user?: { token?: string } }
      ) => {
        if (state.user?.token !== prevState.user?.token) {
          if (state.user?.token) {
            httpManager.setAuthToken(state.user.token);
          } else {
            httpManager.removeAuthToken();
          }
        }
      }
    );
  }

  /**
   * Initialize the API service with current auth state
   */
  public initialize(authStore?: {
    getState: () => { user?: { token?: string } };
  }): void {
    if (authStore) {
      const authState = authStore.getState();
      if (authState.user?.token) {
        httpManager.setAuthToken(authState.user.token);
      }
    }
  }

  /**
   * Auth API endpoints
   */
  public auth = {
    login: async (credentials: LoginCredentials) => {
      return httpManager.post("/auth/login", credentials);
    },

    logout: async () => {
      return httpManager.post("/auth/logout");
    },

    validateToken: async (token: string) => {
      return httpManager.get("/auth/validate-token", {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  };

  /**
   * Products API endpoints with proper typing and backend integration
   */
  public products = {
    getAll: async (filters?: ProductFilters): Promise<Product[]> => {
      const params: Record<string, unknown> = {};

      if (filters?.category && filters.category !== "all") {
        params.category = filters.category;
      }

      if (filters?.search && filters.search.trim().length > 3) {
        params.name = filters.search.trim();
      }

      const response = await httpManager.get<Product[]>("/products", {
        params,
      });

      console.log("API Service - Fetched products:", response.data, params);

      // Transform backend data to include frontend-specific fields
      const products = Array.isArray(response.data) ? response.data : [];
      return products.map((product) => ({
        ...product,
        stock: (product as any).stock || 0, // Default stock to 0 if not provided
        imageUrl: (product as any).imageUrl || undefined,
      }));
    },

    getById: async (id: string): Promise<Product> => {
      const response = await httpManager.get<Product>(`/products/${id}`);
      const product = response.data;
      return {
        ...product,
        stock: (product as any).stock || 0,
        imageUrl: (product as any).imageUrl || undefined,
      };
    },

    create: async (productData: CreateProduct): Promise<Product> => {
      // Transform to backend DTO format
      const backendData = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        stock: productData.stock,
      };

      const response = await httpManager.post<Product>(
        "/products",
        backendData
      );
      const product = response.data;
      return {
        ...product,
        stock: productData.stock || 0,
        imageUrl: productData.imageUrl || undefined,
      };
    },

    update: async (
      id: string,
      productData: UpdateProduct
    ): Promise<Product> => {
      // Transform to backend DTO format, only include defined fields
      const backendData: any = {};

      if (productData.name !== undefined) backendData.name = productData.name;
      if (productData.description !== undefined)
        backendData.description = productData.description;
      if (productData.price !== undefined)
        backendData.price = productData.price;
      if (productData.category !== undefined)
        backendData.category = productData.category;
      if (productData.stock !== undefined)
        backendData.stock = productData.stock;

      const response = await httpManager.patch<Product>(
        `/products/${id}`,
        backendData
      );
      const product = response.data;
      return {
        ...product,
        stock:
          productData.stock !== undefined
            ? productData.stock
            : (product as any).stock || 0,
        imageUrl:
          productData.imageUrl !== undefined
            ? productData.imageUrl
            : (product as any).imageUrl,
      };
    },

    delete: async (id: string): Promise<void> => {
      await httpManager.delete(`/products/${id}`);
    },

    getByCategory: async (category: string): Promise<Product[]> => {
      return apiService.products.getAll({ category });
    },
  };

  /**
   * Generic CRUD operations
   */
  public createCrudEndpoints = <T = any>(resource: string) => ({
    getAll: async (params?: Record<string, any>) => {
      return httpManager.get<T[]>(`/${resource}`, { params });
    },

    getById: async (id: string) => {
      return httpManager.get<T>(`/${resource}/${id}`);
    },

    create: async (data: Partial<T>) => {
      return httpManager.post<T>(`/${resource}`, data);
    },

    update: async (id: string, data: Partial<T>) => {
      return httpManager.put<T>(`/${resource}/${id}`, data);
    },

    patch: async (id: string, data: Partial<T>) => {
      return httpManager.patch<T>(`/${resource}/${id}`, data);
    },

    delete: async (id: string) => {
      return httpManager.delete(`/${resource}/${id}`);
    },
  });
}

// Export the singleton instance
export const apiService = ApiService.getInstance();

// Initialize the service
if (typeof window !== "undefined") {
  apiService.initialize();
}

/**
 * React hook for using API service in components
 */
export const useApiService = () => {
  return apiService;
};

/**
 * Higher-order function to create typed API endpoints
 */
export const createApiEndpoints = <T = any>(resource: string) => {
  return apiService.createCrudEndpoints<T>(resource);
};
