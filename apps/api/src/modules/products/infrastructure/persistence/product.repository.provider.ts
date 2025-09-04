import { Provider } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from '../../domain/interfaces/product.repository.interface';
import { TypeOrmProductRepository } from './typeorm/typeorm-product.repository';
//import { InMemoryPatientRepository } from './memory/in-memory-patient.repository';

export const ProductRepositoryProvider: Provider = {
  provide: PRODUCT_REPOSITORY,
  useExisting: TypeOrmProductRepository,
};
