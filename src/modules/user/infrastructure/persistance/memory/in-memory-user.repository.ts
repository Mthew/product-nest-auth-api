import { Injectable, OnModuleInit } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';
import { Role } from '../../../domain/entities/role.enum';

@Injectable()
export class InMemoryUserRepository implements IUserRepository, OnModuleInit {
  private readonly users: Map<string, User> = new Map();

  async onModuleInit() {
    const doctorUser = await User.create({
      email: 'doctor@example.com',
      plainPassword: 'password123',
      roles: [Role.Doctor],
    });
    const patientUser = await User.create({
      email: 'patient@example.com',
      plainPassword: 'password123',
      roles: [Role.Patient],
    });
    this.save(doctorUser);
    this.save(patientUser);
    console.log('Seeded initial users.');
  }

  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
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
