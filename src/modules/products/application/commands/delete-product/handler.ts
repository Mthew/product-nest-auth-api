import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeleteProductCommand } from './command';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../domain/interfaces/product.repository.interface';
import { ProductNotFoundException } from '../../../domain/exceptions/product-not-found.exception';

@Injectable()
@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand, boolean>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: DeleteProductCommand): Promise<boolean> {
    const { id } = command;

    // First check if product exists
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    return await this.productRepository.delete(id);
  }
}
