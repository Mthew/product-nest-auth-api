import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { CreateProductCommand } from './command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/interfaces/product.repository.interface';
import { ProductMapper } from '../../services/product.mapper';
import { ProductDto } from '../../dtos/product.dto';

@Injectable()
@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand, ProductDto>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductDto> {
    const { dto } = command;
    const newProductEntity = this.productMapper.createDtoToEntity(dto);
    const savedProduct = await this.productRepository.save(newProductEntity);
    return this.productMapper.toDto(savedProduct);
  }
}
