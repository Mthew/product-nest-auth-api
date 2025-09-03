import { Injectable, OnModuleInit, Inject } from '@nestjs/common';

import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../modules/products/domain/interfaces/product.repository.interface';
import { Product } from '../../modules/products/domain/entities/product.entity';
import {
  IUserRepository,
  USER_REPOSITORY,
} from 'src/modules/user/domain/interfaces/user.repository.interface';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { Role } from 'src/modules/user/domain/entities/role.enum';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async onModuleInit() {
    console.log('Checking if seeding is needed...');

    // Check if users already exist to prevent re-seeding on every restart
    const existingAdmin =
      await this.userRepository.findByEmail('admin@example.com');
    if (!existingAdmin) {
      console.log('Seeding initial admin user...');
      const adminUser = await User.create({
        email: 'admin@example.com',
        plainPassword: 'password123',
        roles: [Role.Admin],
      });
      await this.userRepository.save(adminUser);
      console.log('Admin user seeded.');
    } else {
      console.log('Admin user already exists.');
    }

    const existingSellerUser =
      await this.userRepository.findByEmail('seller@example.com');
    if (!existingSellerUser) {
      console.log('Seeding initial seller user...');
      const sellerUser = await User.create({
        email: 'seller@example.com',
        plainPassword: 'password123',
        roles: [Role.Seller],
      });
      await this.userRepository.save(sellerUser);
      console.log('Seller user seeded.');
    } else {
      console.log('Seller user already exists.');
    }

    // Seed sample products
    const existingProducts = await this.productRepository.findAll();
    if (existingProducts.length === 0) {
      console.log('Seeding initial products...');

      const sampleProducts = [
        new Product({
          name: 'iPhone 15 Pro',
          description:
            'Latest iPhone with advanced camera system and A17 Pro chip',
          price: 999.99,
          category: 'Electronics',
        }),
        new Product({
          name: 'MacBook Pro 14"',
          description: 'Professional laptop with M3 chip and Retina display',
          price: 1999.0,
          category: 'Electronics',
        }),
        new Product({
          name: 'Coffee Maker Deluxe',
          description: 'Premium coffee maker with built-in grinder',
          price: 299.99,
          category: 'Appliances',
        }),
        new Product({
          name: 'Running Shoes Pro',
          description: 'Professional running shoes with advanced cushioning',
          price: 149.99,
          category: 'Sports',
        }),
        new Product({
          name: 'Wireless Headphones',
          description: 'Premium noise-canceling wireless headphones',
          price: 299.99,
          category: 'Electronics',
        }),
      ];

      for (const product of sampleProducts) {
        await this.productRepository.save(product);
      }

      console.log('Sample products seeded.');
    } else {
      console.log('Products already exist.');
    }

    console.log('Seeding check complete.');
  }
}
