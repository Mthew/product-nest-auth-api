import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { ProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductMapper {
  createDtoToEntity(dto: CreateProductDto): Product {
    return new Product({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
    });
  }

  updateDtoToEntity(dto: UpdateProductDto): Partial<Product> {
    const updateData: Partial<Product> = {};

    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.price !== undefined) updateData.price = dto.price;
    if (dto.category !== undefined) updateData.category = dto.category;

    return updateData;
  }

  toDto(entity: Product): ProductDto {
    return {
      id: entity.id.toString(), // Convert ObjectId to string
      name: entity.name,
      description: entity.description,
      price: entity.price,
      category: entity.category,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDtoArray(entities: Product[]): ProductDto[] {
    return entities.map((entity) => this.toDto(entity));
  }
}
