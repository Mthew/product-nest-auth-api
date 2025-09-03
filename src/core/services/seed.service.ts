import { Injectable, OnModuleInit, Inject } from '@nestjs/common';

import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../modules/patients/domain/interfaces/patient.repository.interface';
import { Patient } from '../../modules/patients/domain/entities/patient.entity';
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
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async onModuleInit() {
    console.log('Checking if seeding is needed...');

    // Check if users already exist to prevent re-seeding on every restart
    const existingDoctor =
      await this.userRepository.findByEmail('doctor@example.com');
    if (!existingDoctor) {
      console.log('Seeding initial doctor user...');
      const doctorUser = await User.create({
        email: 'doctor@example.com',
        plainPassword: 'password123',
        roles: [Role.Doctor],
      });
      await this.userRepository.save(doctorUser);
      console.log('Doctor user seeded.');
    } else {
      console.log('Doctor user already exists.');
    }

    const existingPatientUser = await this.userRepository.findByEmail(
      'patient@example.com',
    );
    if (!existingPatientUser) {
      console.log('Seeding initial patient user...');
      const patientUser = await User.create({
        email: 'patient@example.com',
        plainPassword: 'password123',
        roles: [Role.Patient],
      });
      await this.userRepository.save(patientUser);

      // Seed a related patient record (example)
      console.log('Seeding initial patient record...');
      const patientRecord = new Patient({
        firstName: 'Test',
        lastName: 'Patient',
        birthDate: '1995-01-20',
        medicalHistory: ['Initial checkup'],
      });
      // Link patient record to user if your design includes it (e.g., patientRecord.userId = patientUser.id)
      await this.patientRepository.save(patientRecord);
      console.log('Patient user and record seeded.');
    } else {
      console.log('Patient user already exists.');
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
