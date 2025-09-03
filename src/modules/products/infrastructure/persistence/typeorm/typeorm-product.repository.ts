import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Product } from '../../../domain/entities/product.entity';
import { IProductRepository } from '../../../domain/interfaces/product.repository.interface';

@Injectable()
export class TypeOrmProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
  ) {}

  async save(product: Product): Promise<Product> {
    return await this.productRepository.save(product);
  }

  async findById(id: string): Promise<Product | null> {
    try {
      // Validate ObjectId format
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const product = await this.productRepository.findOne({
        where: { _id: new ObjectId(id) } as any,
      });

      return product || null;
    } catch (error) {
      console.error('Error finding product by id:', error);
      return null;
    }
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productRepository.find({
      where: { category } as any,
    });
  }

  async update(
    id: string,
    updateData: Partial<Product>,
  ): Promise<Product | null> {
    try {
      // Validate ObjectId format
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const objectId = new ObjectId(id);

      // First update the document
      await this.productRepository.updateOne(
        { _id: objectId } as any,
        { $set: updateData } as any,
      );

      // Then fetch the updated document
      const updatedProduct = await this.productRepository.findOne({
        where: { _id: objectId } as any,
      });

      return updatedProduct || null;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      // Validate ObjectId format
      if (!ObjectId.isValid(id)) {
        return false;
      }

      const result = await this.productRepository.deleteOne({
        _id: new ObjectId(id),
      } as any);

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}
