import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id: ObjectId;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column('simple-array')
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static async create({
    email,
    plainPassword,
    roles,
  }: {
    email: string;
    plainPassword: string;
    roles: Role[];
  }): Promise<User> {
    const user = new User();
    user.email = email;
    user.passwordHash = await bcrypt.hash(plainPassword, 10);
    user.roles = roles;
    return user;
  }

  async validatePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.passwordHash);
  }
}
