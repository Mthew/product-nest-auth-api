import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  MinLength,
} from 'class-validator';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 'Jonathan',
    description: 'The first name of the patient',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Doethan',
    description: 'The last name of the patient',
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @ApiPropertyOptional({
    example: '1991-06-16',
    description: 'The birth date of the patient (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    example: ['Allergy to penicillin', 'History of asthma', 'Recent flu shot'],
    description: 'Updated medical history entries',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicalHistory?: string[];
}
