import { Provider } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/interfaces/user.repository.interface';
import { TypeOrmUserRepository } from './typeorm/typeorm-user.repository';
//import { InMemoryUserRepository } from './memory/in-memory-user.repository';

export const UserRepositoryProvider: Provider = {
  provide: USER_REPOSITORY,
  useClass: TypeOrmUserRepository,
};
