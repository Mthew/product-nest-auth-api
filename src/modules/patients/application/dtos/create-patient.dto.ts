import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the patient',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the patient' })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  lastName: string;

  @ApiProperty({
    example: '1990-05-15',
    description: 'The birth date of the patient (YYYY-MM-DD)',
  })
  @IsNotEmpty()
  @IsDateString()
  birthDate: string;

  @ApiProperty({
    example: ['Allergy to penicillin', 'History of asthma'],
    description: 'Medical history entries',
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  medicalHistory?: string[];
}
