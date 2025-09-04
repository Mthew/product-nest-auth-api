import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: MongoRepository<User>,
  ) {}

  async save(user: User): Promise<User> {
    user.email = user.email.toLowerCase();
    return this.ormRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    try {
      // Validate ObjectId format
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const user = await this.ormRepository.findOne({
        where: { _id: new ObjectId(id) } as any,
      });

      return user || null;
    } catch (error) {
      console.error('Error finding user by id:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const lowerEmail = email.toLowerCase();

      // MongoDB native find method - no Query Builder needed
      const user = await this.ormRepository.findOne({
        where: { email: lowerEmail } as any,
      });

      return user || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }
}
