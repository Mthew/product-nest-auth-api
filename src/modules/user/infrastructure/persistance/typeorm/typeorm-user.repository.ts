import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository } from '../../../domain/interfaces/user.repository.interface';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly ormRepository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    user.email = user.email.toLowerCase();
    return this.ormRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.ormRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    const lowerEmail = email.toLowerCase();

    const user = await this.ormRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email: lowerEmail })
      .getOne();

    return user;
  }
}
