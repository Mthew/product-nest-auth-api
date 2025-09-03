import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('DATABASE_URL'),
        // Alternative: Use individual variables
        // host: configService.get<string>('DB_HOST'),
        // port: configService.get<number>('DB_PORT', 27017),
        // username: configService.get<string>('DB_USERNAME'),
        // password: configService.get<string>('DB_PASSWORD'),
        // database: configService.get<string>('DB_DATABASE'),

        autoLoadEntities: true,
        synchronize:
          configService.get<string>('TYPEORM_SYNCHRONIZE') === 'true',

        ssl: true,

        logging: process.env.NODE_ENV === 'development',
        useUnifiedTopology: true,
      }),
    }),
  ],
})
export class PersistanceModule {}
