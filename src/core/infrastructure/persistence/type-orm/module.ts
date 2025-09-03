import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/modules/products/domain/entities/product.entity';
import { User } from 'src/modules/user/domain/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig: any = {
          type: 'mongodb',
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '27017')),
          database: configService.get('DB_NAME', 'product_management'),
          useUnifiedTopology: true,
          entities: [User, Product],
          synchronize: configService.get('NODE_ENV') !== 'production',
          logging: configService.get('NODE_ENV') === 'development',
        };

        // Add authentication if credentials are provided
        const username = configService.get('DB_USERNAME');
        const password = configService.get('DB_PASSWORD');

        if (username && password) {
          dbConfig.username = username;
          dbConfig.password = password;
          dbConfig.authSource = 'admin';
        }

        return dbConfig;
      },
      inject: [ConfigService],
    }),
  ],
})
export class PersistenceModule {}
