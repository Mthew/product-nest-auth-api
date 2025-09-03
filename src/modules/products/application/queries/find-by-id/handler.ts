import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { FindProductByIdQuery } from './query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/interfaces/product.repository.interface';
import { ProductMapper } from '../../services/product.mapper';
import { ProductDto } from '../../dtos/product.dto';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';

@Injectable()
@QueryHandler(FindProductByIdQuery)
export class FindProductByIdHandler
  implements IQueryHandler<FindProductByIdQuery, ProductDto>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async execute(query: FindProductByIdQuery): Promise<ProductDto> {
    const { id } = query;
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return this.productMapper.toDto(product);
  }
}
