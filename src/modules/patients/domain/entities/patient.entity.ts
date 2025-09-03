import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('patients') // Define the table name
export class Patient {
  // Use PrimaryGeneratedColumn for auto-generated UUIDs by the DB
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 100 }) // Specify DB type and constraints
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'date' }) // Use 'date' or 'timestamp' as appropriate
  birthDate: Date; // TypeORM handles Date objects

  @Column({ type: 'text', array: true, default: () => "'{}'" }) // PostgreSQL array type for text
  medicalHistory: string[];

  // Optional: Add timestamps automatically managed by TypeORM
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Constructor remains largely the same for creating NEW instances
  // TypeORM bypasses the constructor when loading existing entities
  constructor(props: {
    // id is handled by TypeORM on generation/load
    firstName: string;
    lastName: string;
    birthDate: Date | string; // Allow string for flexibility, convert below
    medicalHistory?: string[];
    // createdAt/updatedAt are handled by TypeORM
  }) {
    // Assign properties ONLY IF props is provided (when creating new instance)
    if (props) {
      this.firstName = props.firstName;
      this.lastName = props.lastName;
      this.birthDate =
        typeof props.birthDate === 'string'
          ? new Date(props.birthDate)
          : props.birthDate;
      this.medicalHistory = props.medicalHistory ?? [];

      if (!this.firstName || !this.lastName) {
        throw new Error('Patient first and last name cannot be empty');
      }
    }
  }

  updateInfo(props: {
    firstName?: string;
    lastName?: string;
    birthDate?: Date;
    medicalHistory?: string[];
  }): void {
    if (props.firstName !== undefined) this.firstName = props.firstName;
    if (props.lastName !== undefined) this.lastName = props.lastName;
    if (props.birthDate !== undefined) this.birthDate = props.birthDate;
    if (props.medicalHistory !== undefined)
      this.medicalHistory = props.medicalHistory;
  }

  addMedicalHistoryEntry(entry: string): void {
    this.medicalHistory.push(entry);
  }
}
