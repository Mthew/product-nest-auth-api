import { Injectable } from '@nestjs/common';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientDto } from '../dtos/patient.dto';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { UpdatePatientDto } from '../dtos/update-patient.dto';

@Injectable()
export class PatientMapper {
  toDto(entity: Patient): PatientDto {
    const dto = new PatientDto();
    dto.id = entity.id;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.birthDate = entity.birthDate;
    dto.medicalHistory = entity.medicalHistory;
    return dto;
  }

  toDtoList(entities: Patient[]): PatientDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  createDtoToEntity(dto: CreatePatientDto): Patient {
    return new Patient({
      firstName: dto.firstName,
      lastName: dto.lastName,
      birthDate: new Date(dto.birthDate),
      medicalHistory: dto.medicalHistory ?? [],
    });
  }

  updateDtoToEntity(dto: UpdatePatientDto): Partial<Patient> {
    const partialEntity: Partial<Patient> = {};

    if (dto.firstName !== undefined) {
      partialEntity.firstName = dto.firstName;
    }
    if (dto.lastName !== undefined) {
      partialEntity.lastName = dto.lastName;
    }
    if (dto.birthDate !== undefined) {
      partialEntity.birthDate = new Date(dto.birthDate);
    }
    if (dto.medicalHistory !== undefined) {
      partialEntity.medicalHistory = dto.medicalHistory;
    }

    return partialEntity;
  }
}
