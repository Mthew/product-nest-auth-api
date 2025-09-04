import { useCallback, useEffect } from "react";
import { useProductStore } from "@/stores/product";
import {
  Product,
  CreateProduct,
  UpdateProduct,
  ProductFilters,
} from "@/modules/product/domain/entities/product.interface";

export interface UseProductReturn {
  // State
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  filters: ProductFilters;

  // Actions
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  createProduct: (productData: CreateProduct) => Promise<Product | null>;
  updateProduct: (
    id: string,
    productData: UpdateProduct
  ) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  refreshProducts: () => Promise<void>;

  // Utility functions
  getProductById: (id: string) => Product | null;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  clearError: () => void;
  setFilters: (filters: ProductFilters) => void;

  // Computed properties
  totalProducts: number;
  categoriesCount: Record<string, number>;
  totalValue: number;
  lowStockProducts: Product[];
}

export const useProduct = (): UseProductReturn => {
  const {
    // State
    products,
    currentProduct,
    loading,
    error,
    filters,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct: createProductStore,
    updateProduct: updateProductStore,
    deleteProduct: deleteProductStore,
    refreshProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    clearError,
    setFilters,
  } = useProductStore();

  // Enhanced actions with additional logic
  const createProduct = useCallback(
    async (productData: CreateProduct): Promise<Product | null> => {
      const result = await createProductStore(productData);
      if (result && !error) {
        // Optionally refresh products to ensure consistency
        // await refreshProducts();
      }
      return result;
    },
    [createProductStore, error]
  );

  const updateProduct = useCallback(
    async (id: string, productData: UpdateProduct): Promise<Product | null> => {
      console.log(
        "Updating product ID: ======>>>>>>>>>>",
        id,
        "with data:",
        productData
      );
      const result = await updateProductStore(id, productData);
      if (result && !error) {
        // Optionally refresh products to ensure consistency
        // await refreshProducts();
      }
      return result;
    },
    [updateProductStore, error]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await deleteProductStore(id);
      if (result && !error) {
        // Optionally refresh products to ensure consistency
        // await refreshProducts();
      }
      return result;
    },
    [deleteProductStore, error]
  );

  // Computed properties
  const totalProducts = products.length;

  const categoriesCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = products.reduce((sum, product) => {
    const stock = product.stock || 0;
    return sum + product.price * stock;
  }, 0);

  const lowStockProducts = products.filter(
    (product) => (product.stock || 0) < 10
  );

  // Auto-fetch products on mount if not already loaded and not currently loading
  useEffect(() => {
    if (products.length === 0 && !loading) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - we only want this to run on mount

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    filters,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,

    // Utility functions
    getProductById,
    getProductsByCategory,
    searchProducts,
    clearError,
    setFilters,

    // Computed properties
    totalProducts,
    categoriesCount,
    totalValue,
    lowStockProducts,
  };
};
