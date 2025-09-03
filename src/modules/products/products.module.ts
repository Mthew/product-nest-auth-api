import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { ProductController } from './presentation/http/product.controller';
import { Product } from './domain/entities/product.entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/typeorm/typeorm-product.repository';
import { PRODUCT_REPOSITORY } from './domain/interfaces/product.repository.interface';

// --- Import Handlers ---
import { CreateProductHandler } from './application/commands/create-product/handler';
import { FindAllProductsHandler } from './application/queries/find-all/handler';
import { FindProductByIdHandler } from './application/queries/find-by-id/handler';
import { UpdateProductHandler } from './application/commands/update-product/handler';
import { DeleteProductHandler } from './application/commands/delete-product/handler';

// --- Import Services ---
import { ProductMapper } from './application/services/product.mapper';
import { ProductRepositoryProvider } from './infrastructure/persistence/product.repository.provider';

// --- Group Handlers ---
const CommandHandlers = [
  CreateProductHandler,
  UpdateProductHandler,
  DeleteProductHandler,
];
const QueryHandlers = [FindAllProductsHandler, FindProductByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Product]), ConfigModule],
  controllers: [ProductController],
  providers: [
    TypeOrmProductRepository,
    {
      provide: PRODUCT_REPOSITORY,
      useExisting: TypeOrmProductRepository,
    },
    // ProductRepositoryProvider,
    ProductMapper,
    ...CommandHandlers,
    ...QueryHandlers,
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
