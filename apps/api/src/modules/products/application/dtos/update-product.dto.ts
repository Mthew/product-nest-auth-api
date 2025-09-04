import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsPositive,
  MinLength,
  MaxLength,
  Min,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'iPhone 15 Pro Max',
    description: 'The name of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name?: string;

  @ApiProperty({
    example: 'Updated iPhone model with enhanced features',
    description: 'The description of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    example: 1099.99,
    description: 'The price of the product in USD',
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Min(0.01)
  price?: number;

  @ApiProperty({
    example: 50,
    description:
      'The stock quantity of the product (must be a positive integer)',
    minimum: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    example: 'Smartphones',
    description: 'The category of the product',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  category?: string;
}
