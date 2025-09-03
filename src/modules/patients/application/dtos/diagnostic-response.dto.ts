import { ApiProperty } from '@nestjs/swagger';

export class DiagnosisResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' })
  patientId: string;
  @ApiProperty({ example: ['History of asthma', 'Recent chest pain'] })
  medicalHistory: string[];
  @ApiProperty({
    example: 'Possible viral infection. Recommend further testing.',
  })
  suggestedDiagnosis: string;
}
