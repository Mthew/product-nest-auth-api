// Product interfaces based on backend API DTOs

export interface ProductDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
}

// Frontend-specific product interface with stock support
export interface Product extends ProductDto {
  stock?: number;
  imageUrl?: string;
}

export interface CreateProduct extends CreateProductDto {
  stock?: number;
  imageUrl?: string;
}

export interface UpdateProduct extends UpdateProductDto {
  stock?: number;
  imageUrl?: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
