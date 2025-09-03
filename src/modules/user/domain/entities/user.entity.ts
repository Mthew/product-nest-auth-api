import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from './role.enum';

const SALT_ROUNDS = 10;

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', unique: true, length: 255 }) // Emails should be unique
  email: string;

  @Column({ type: 'varchar', select: false }) // Prevent password hash from being selected by default
  passwordHash: string;

  // Use enum type with array support
  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [], // Default to empty array
  })
  roles: Role[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Constructor for creating NEW instances
  // NOTE: TypeORM uses this when you do `new User(...)` and then `repo.save(userInstance)`
  // It doesn't call it when loading existing entities from DB.
  constructor(props?: {
    // id is handled by TypeORM
    email: string;
    passwordHash: string; // Expect hash to be pre-computed before calling constructor
    roles: Role[];
  }) {
    if (props) {
      if (
        !props.email ||
        !props.passwordHash ||
        !props.roles ||
        props.roles.length === 0
      ) {
        throw new Error('User email, password hash, and roles are required.');
      }
      this.email = props.email.toLowerCase();
      this.passwordHash = props.passwordHash;
      this.roles = props.roles;
    }
  }

  // Instance method - works fine on entities loaded by TypeORM
  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Static factory method - useful for creating new users with plain password
  static async create(props: {
    email: string;
    plainPassword: string;
    roles: Role[];
  }): Promise<User> {
    const passwordHash = await bcrypt.hash(props.plainPassword, SALT_ROUNDS);
    // Manually create instance to ensure constructor logic (lowercasing email) runs
    const user = new User({
      email: props.email,
      passwordHash: passwordHash,
      roles: props.roles,
    });
    // Return the instance ready to be saved by the repository
    return user;
  }
}
