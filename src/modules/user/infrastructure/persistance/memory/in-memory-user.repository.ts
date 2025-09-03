import { Injectable, OnModuleInit } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.enum';

@Injectable()
export class InMemoryUserRepository implements IUserRepository, OnModuleInit {
  private readonly users: Map<string, User> = new Map();

  async onModuleInit() {
    const adminUser = await User.create({
      email: 'admin@example.com',
      plainPassword: 'password123',
      roles: [Role.Admin],
    });
    const sellerUser = await User.create({
      email: 'seller@example.com',
      plainPassword: 'password123',
      roles: [Role.Seller],
    });
    this.save(adminUser);
    this.save(sellerUser);
    console.log('Seeded initial users.');
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id.toString(), user);
    console.log(`Saved user: ${user.email}, Total: ${this.users.size}`);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const lowerEmail = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email === lowerEmail) {
        return user;
      }
    }
    return null;
  }
}
