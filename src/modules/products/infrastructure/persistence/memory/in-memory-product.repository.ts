import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { Product } from 'src/modules/products/domain/entities/product.entity';
import { IProductRepository } from 'src/modules/products/domain/interfaces/product.repository.interface';

@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private readonly products: Map<string, Product> = new Map();

  async save(product: Product): Promise<Product> {
    // Generate ObjectId if not exists (for new products)
    if (!product.id) {
      (product as any).id = new ObjectId();
    }

    // Set timestamps for new products
    if (!product.createdAt) {
      (product as any).createdAt = new Date();
    }
    (product as any).updatedAt = new Date();

    const productId = product.id.toString();
    this.products.set(productId, product);
    console.log(`Saved product: ${productId}, Total: ${this.products.size}`);
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.products.get(id);
    return product ? product : null;
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async findByCategory(category: string): Promise<Product[]> {
    const allProducts = Array.from(this.products.values());
    return allProducts.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase(),
    );
  }

  async update(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product | null> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return null;
    }

    // Update the existing product with new data
    const updatedProduct = Object.assign(existingProduct, {
      ...productData,
      updatedAt: new Date(),
    });

    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.products.delete(id);
    console.log(
      `Deleted product: ${id}, Success: ${deleted}, Remaining: ${this.products.size}`,
    );
    return deleted;
  }
}
