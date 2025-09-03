import { ApiProperty } from '@nestjs/swagger';

export class PatientDto {
  @ApiProperty({
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    description: 'Unique identifier',
  })
  id: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastName: string;

  @ApiProperty({
    example: '1990-05-15T00:00:00.000Z',
    description: 'Birth date',
  })
  birthDate: Date;

  @ApiProperty({
    example: ['Allergy to penicillin'],
    description: 'Medical history',
  })
  medicalHistory: string[];
}
