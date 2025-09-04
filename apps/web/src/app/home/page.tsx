"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Package, DollarSign, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { ProductCard } from "@/components/features/product";
import { ProductManagementHeader } from "@/components/features/product/product-management-header";
import { ProductFilter } from "@/components/features/product/product-filter";
import {
  ProductForm,
  type Product as FormProduct,
} from "@/components/features/product/product-form";
import { useProduct } from "@/hooks/useProduct";
import { usePagination } from "@/hooks/usePagination";
import { Product as DomainProduct } from "@/modules/product/domain/entities/product.interface";
import { Product as CardProduct } from "@/modules/product/domain";
import { useAuth } from "@/hooks/useAuth";

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Livestock",
  "Dairy",
  "Herbs",
  "Seeds",
  "Equipment",
];

export default function ProductManagement() {
  // All hooks must be called at the top level, before any conditional returns
  const { user, isAuthenticated } = useAuth();
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductsByCategory,
    totalProducts,
    totalValue,
    lowStockProducts,
    clearError,
  } = useProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<FormProduct | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Filter products based on search and category
  const filteredProducts = (() => {
    let filtered = products;

    // Apply category filter
    if (filterCategory !== "all") {
      filtered = getProductsByCategory(filterCategory);
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = searchProducts(searchTerm);
      // If category filter is also applied, intersect the results
      if (filterCategory !== "all") {
        const categoryFiltered = getProductsByCategory(filterCategory);
        filtered = filtered.filter((product) =>
          categoryFiltered.some((catProduct) => catProduct.id === product.id)
        );
      }
    }

    return filtered;
  })();

  // Pagination hook for filtered products - must be called before any returns
  const {
    currentPage,
    totalPages,
    totalItems,
    currentData: paginatedProducts,
    goToPage,
  } = usePagination<DomainProduct>({
    data: filteredProducts,
    itemsPerPage: 10,
    initialPage: 1,
  });

  // Clear error when component mounts and log state
  useEffect(() => {
    console.log("🔍 Product Management State:", {
      isAuthenticated,
      user: user?.email,
      products: products.length,
      loading,
      error,
    });

    if (error) {
      console.error("❌ Product API Error:", error);
      toast.error(`API Error: ${error}`);
      clearError();
    }
  }, [error, clearError, products.length, loading, isAuthenticated, user]);

  // Check authentication status
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <ProductManagementHeader
            title="Authentication Required"
            subtitle="Please log in to access product management"
            description="You need to be authenticated to view and manage agricultural products"
          />
          <div className="flex justify-center items-center py-12">
            <Card className="p-8">
              <CardContent className="text-center">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Access Restricted
                </h3>
                <p className="text-muted-foreground mb-4">
                  Please log in with your credentials to access the product
                  management system.
                </p>
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Add loading state display
  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <ProductManagementHeader
            title="Agricultural Product Management"
            subtitle="Loading your agricultural products..."
            description="Please wait while we fetch your product data"
          />
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Open form for adding new product
  const openAddForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  // Open form for editing existing product
  const openEditForm = (product: DomainProduct) => {
    // Convert DomainProduct to form Product format
    const formProduct: FormProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock || 0,
    };
    setEditingProduct(formProduct);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (productData: FormProduct) => {
    try {
      let result = null;

      if (editingProduct) {
        // Update existing product
        const updateData = {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          imageUrl: productData.imageUrl,
        };
        result = await updateProduct(editingProduct.id!, updateData);

        if (result) {
          toast.success("Product updated successfully");
        }
      } else {
        // Create new product
        const createData = {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          stock: productData.stock,
          imageUrl: productData.imageUrl,
        };
        result = await createProduct(createData);

        if (result) {
          toast.success("Product created successfully");
        }
      }

      if (result) {
        setIsFormOpen(false);
        setEditingProduct(null);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error saving product:", errorMessage);
      toast.error("Failed to save product. Please try again.");
    }
  };

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const success = await deleteProduct(productId);

        if (success) {
          toast.success("Product deleted successfully");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        console.error("Error deleting product:", errorMessage);
        toast.error("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header Component */}
        <ProductManagementHeader
          title="Agricultural Product Management"
          subtitle="Manage your agricultural products, inventory, and pricing with Croper"
          description="Your digital solution for modern farming and agricultural product management"
        />

        {/* Summary Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
              <p className="text-xs text-muted-foreground">
                Agricultural products in inventory
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total inventory value
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Low Stock Alert
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {lowStockProducts.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Products with stock &lt; 10
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Filter Component */}
          <ProductFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            categories={CATEGORIES}
          />

          {/* Add Product Button */}
          <Button
            onClick={openAddForm}
            className="w-full sm:w-auto bg-[#2d7e06] hover:bg-[#245a05] text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Product Form Component */}
        <ProductForm
          product={editingProduct}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          categories={CATEGORIES}
        />

        {/* Products Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginatedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-muted-foreground text-sm mt-2">
                {searchTerm || filterCategory !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first agricultural product"}
              </p>
            </div>
          ) : (
            paginatedProducts.map((product) => {
              // The product is already in the correct format for ProductCard
              // Wrapper function to handle type conversion
              const handleEdit = (cardProd: CardProduct) => {
                const domainProd: DomainProduct = {
                  id: cardProd.id,
                  name: cardProd.name,
                  description: cardProd.description,
                  price: cardProd.price,
                  category: cardProd.category,
                  createdAt: cardProd.createdAt,
                  updatedAt: cardProd.updatedAt,
                  stock: product.stock,
                };
                openEditForm(domainProd);
              };

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  openEditDialog={handleEdit}
                  deleteProduct={handleDelete}
                />
              );
            })
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 10 && (
          <div className="flex justify-center mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          </div>
        )}

        {/* Summary */}
        {paginatedProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Showing {Math.min((currentPage - 1) * 10 + 1, totalItems)} to{" "}
            {Math.min(currentPage * 10, totalItems)} of {totalItems}{" "}
            agricultural products
            {totalItems !== products.length && (
              <span className="ml-2">
                (filtered from {products.length} total)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
