import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PersistanceModule } from './core/infrastructure/persistence/type-orm/module';
import { SeedService } from './core/services/seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PersistanceModule,
    PatientsModule,
    ProductsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [SeedService],
})
export class AppModule {}
