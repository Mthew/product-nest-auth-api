import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './application/services/user.service';
//import { UserRepositoryProvider } from './infrastructure/persistance/user.repository.provider';
import { User } from './domain/entities/user.entity';
import { TypeOrmUserRepository } from './infrastructure/persistance/typeorm/typeorm-user.repository';
import { USER_REPOSITORY } from './domain/interfaces/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    TypeOrmUserRepository,
    {
      provide: USER_REPOSITORY,
      useExisting: TypeOrmUserRepository,
    },
    UsersService,
  ],
  exports: [UsersService, USER_REPOSITORY],
})
export class UsersModule {}
