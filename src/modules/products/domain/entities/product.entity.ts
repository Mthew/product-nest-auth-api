import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('products') // Define the collection name
export class Product {
  // Use ObjectIdColumn for MongoDB ObjectId
  @ObjectIdColumn()
  readonly id: ObjectId;

  @Column({ type: 'string', length: 200 }) // Product name
  name: string;

  @Column({ type: 'string', length: 1000 }) // Product description
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // Price with 2 decimal places
  price: number;

  @Column({ type: 'string', length: 100 }) // Product category
  category: string;

  // Optional: Add timestamps automatically managed by TypeORM
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Constructor for creating NEW instances
  // TypeORM bypasses the constructor when loading existing entities
  constructor(props: {
    // id is handled by TypeORM/MongoDB on generation/load
    name: string;
    description: string;
    price: number;
    category: string;
    // createdAt/updatedAt are handled by TypeORM
  }) {
    // Assign properties ONLY IF props is provided (when creating new instance)
    if (props) {
      this.name = props.name;
      this.description = props.description;
      this.price = props.price;
      this.category = props.category;

      if (!this.name || !this.description) {
        throw new Error('Product name and description cannot be empty');
      }

      if (this.price < 0) {
        throw new Error('Product price cannot be negative');
      }
    }
  }

  updateInfo(props: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
  }): void {
    if (props.name !== undefined) this.name = props.name;
    if (props.description !== undefined) this.description = props.description;
    if (props.price !== undefined) {
      if (props.price < 0) {
        throw new Error('Product price cannot be negative');
      }
      this.price = props.price;
    }
    if (props.category !== undefined) this.category = props.category;
  }

  // Helper method to format price as currency
  getFormattedPrice(currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(this.price);
  }
}
