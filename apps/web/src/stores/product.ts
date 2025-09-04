import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { apiService } from "@/services/api.service";
import {
  Product,
  CreateProduct,
  UpdateProduct,
  ProductFilters,
} from "@/modules/product/domain/entities/product.interface";

interface ProductState {
  // State
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;

  // Actions
  setProducts: (products: Product[]) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: ProductFilters) => void;
  clearError: () => void;

  // Async actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (productData: CreateProduct) => Promise<Product | null>;
  updateProduct: (
    id: string,
    productData: UpdateProduct
  ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  // Utility actions
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProductInStore: (id: string, updates: Partial<Product>) => void;
  getProductById: (id: string) => Product | null;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      // Initial state
      products: [],
      currentProduct: null,
      loading: false,
      error: null,
      filters: {},

      // Sync actions
      setProducts: (products) => set({ products }),

      setCurrentProduct: (product) => set({ currentProduct: product }),

      setLoading: (loading) => set({ loading }),

      setError: (error) => set({ error }),

      setFilters: (filters) => set({ filters }),

      clearError: () => set({ error: null }),

      // Async actions
      fetchProducts: async (filters) => {
        set({ loading: true, error: null });

        try {
          const filtersToUse = filters || get().filters;
          const products = await apiService.products.getAll(filtersToUse);

          console.log("Fetched products:===========>>>>>>>>>>>>>>", products);

          set({
            products,
            filters: filtersToUse,
            loading: false,
          });
        } catch (error: unknown) {
          console.error("Error fetching products:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch products",
            loading: false,
          });
        }
      },

      fetchProductById: async (id) => {
        set({ loading: true, error: null });

        try {
          const product = await apiService.products.getById(id);
          set({
            currentProduct: product,
            loading: false,
          });
          return product;
        } catch (error: unknown) {
          console.error("Error fetching product:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch product",
            loading: false,
          });
          return null;
        }
      },

      createProduct: async (productData) => {
        set({ loading: true, error: null });

        try {
          const newProduct = await apiService.products.create(productData);

          // Add to store
          const currentProducts = get().products;
          set({
            products: [...currentProducts, newProduct],
            loading: false,
          });

          return newProduct;
        } catch (error: any) {
          console.error("Error creating product:", error);
          set({
            error: error.message || "Failed to create product",
            loading: false,
          });
          return null;
        }
      },

      updateProduct: async (id, productData) => {
        set({ loading: true, error: null });

        try {
          const updatedProduct = await apiService.products.update(
            id,
            productData
          );

          // Update in store
          const currentProducts = get().products;
          const updatedProducts = currentProducts.map((product) =>
            product.id === id ? updatedProduct : product
          );

          set({
            products: updatedProducts,
            currentProduct:
              get().currentProduct?.id === id
                ? updatedProduct
                : get().currentProduct,
            loading: false,
          });

          return updatedProduct;
        } catch (error: any) {
          console.error("Error updating product:", error);
          set({
            error: error.message || "Failed to update product",
            loading: false,
          });
          return null;
        }
      },

      deleteProduct: async (id) => {
        set({ loading: true, error: null });

        try {
          await apiService.products.delete(id);

          // Remove from store
          const currentProducts = get().products;
          const filteredProducts = currentProducts.filter(
            (product) => product.id !== id
          );

          set({
            products: filteredProducts,
            currentProduct:
              get().currentProduct?.id === id ? null : get().currentProduct,
            loading: false,
          });

          return true;
        } catch (error: any) {
          console.error("Error deleting product:", error);
          set({
            error: error.message || "Failed to delete product",
            loading: false,
          });
          return false;
        }
      },

      refreshProducts: async () => {
        const currentFilters = get().filters;
        await get().fetchProducts(currentFilters);
      },

      // Utility actions
      addProduct: (product) => {
        const currentProducts = get().products;
        set({ products: [...currentProducts, product] });
      },

      removeProduct: (id) => {
        const currentProducts = get().products;
        const filteredProducts = currentProducts.filter(
          (product) => product.id !== id
        );
        set({
          products: filteredProducts,
          currentProduct:
            get().currentProduct?.id === id ? null : get().currentProduct,
        });
      },

      updateProductInStore: (id, updates) => {
        const currentProducts = get().products;
        const updatedProducts = currentProducts.map((product) =>
          product.id === id ? { ...product, ...updates } : product
        );

        set({
          products: updatedProducts,
          currentProduct:
            get().currentProduct?.id === id
              ? { ...get().currentProduct!, ...updates }
              : get().currentProduct,
        });
      },

      getProductById: (id) => {
        const products = get().products;
        return products.find((product) => product.id === id) || null;
      },

      getProductsByCategory: (category) => {
        const products = get().products;
        return products.filter((product) => product.category === category);
      },

      searchProducts: (query) => {
        const products = get().products;
        const lowercaseQuery = query.toLowerCase();

        return products.filter(
          (product) =>
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
      },
    }),
    {
      name: "product-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist products and filters, not loading states or errors
        products: state.products,
        filters: state.filters,
      }),
    }
  )
);
