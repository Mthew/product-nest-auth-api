import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The unique identifier of the product (MongoDB ObjectId)',
  })
  id: string;

  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'The name of the product',
  })
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model with advanced camera system',
    description: 'The description of the product',
  })
  description: string;

  @ApiProperty({
    example: 999.99,
    description: 'The price of the product in USD',
  })
  price: number;

  @ApiProperty({
    example: 'Electronics',
    description: 'The category of the product',
  })
  category: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00Z',
    description: 'The creation date of the product record',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-20T15:45:00Z',
    description: 'The last update date of the product record',
  })
  updatedAt: Date;
}
