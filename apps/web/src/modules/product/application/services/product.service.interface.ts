import {
  Product,
  CreateProduct,
  UpdateProduct,
  ProductFilters,
} from "../../domain/entities/product.interface";

export interface ProductService {
  getAllProducts(filters?: ProductFilters): Promise<Product[]>;
  getProductById(id: string): Promise<Product>;
  createProduct(product: CreateProduct): Promise<Product>;
  updateProduct(id: string, product: UpdateProduct): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByCategory(category: string): Promise<Product[]>;
  create(product: CreateProduct): Promise<Product>;
  update(id: string, product: UpdateProduct): Promise<Product>;
  delete(id: string): Promise<boolean>;
}
