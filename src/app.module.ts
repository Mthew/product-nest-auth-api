import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { ProductsModule } from './modules/products/products.module';
import { SeedService } from './core/services/seed.service';

import { PersistenceModule } from './core/infrastructure/persistence/type-orm/module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PersistenceModule,
    AuthModule,
    UsersModule,
    ProductsModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
