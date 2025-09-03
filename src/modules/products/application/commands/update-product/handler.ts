import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateProductCommand } from './command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/interfaces/product.repository.interface';
import { ProductMapper } from '../../services/product.mapper';
import { ProductDto } from '../../dtos/product.dto';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';

@Injectable()
@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand, ProductDto>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductDto> {
    const { id, dto } = command;

    // First check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    const updateData = this.productMapper.updateDtoToEntity(dto);
    const updatedProduct = await this.productRepository.update(id, updateData);

    if (!updatedProduct) {
      throw new ProductNotFoundException(id);
    }

    return this.productMapper.toDto(updatedProduct);
  }
}
