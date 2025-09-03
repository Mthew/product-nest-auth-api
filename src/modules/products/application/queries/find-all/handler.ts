import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { FindAllProductsQuery } from './query';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/interfaces/product.repository.interface';
import { ProductMapper } from '../../services/product.mapper';
import { ProductDto } from '../../dtos/product.dto';

@Injectable()
@QueryHandler(FindAllProductsQuery)
export class FindAllProductsHandler
  implements IQueryHandler<FindAllProductsQuery, ProductDto[]>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly productMapper: ProductMapper,
  ) {}

  async execute(query: FindAllProductsQuery): Promise<ProductDto[]> {
    const { category } = query;

    let products;
    if (category) {
      products = await this.productRepository.findByCategory(category);
    } else {
      products = await this.productRepository.findAll();
    }

    return this.productMapper.toDtoArray(products);
  }
}
