import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger, ForbiddenException } from '@nestjs/common';

import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientMapper } from '../../services/patient.mapper';
import { PatientDto } from '../../dtos/patient.dto';
import { Patient } from '../../../domain/entities/patient.entity';
import { PatientNotFoundException } from '../../../domain/exceptions/patient-not-found.exception';
import { FindPatientByIdQuery } from './query';

@Injectable()
@QueryHandler(FindPatientByIdQuery)
export class FindPatientByIdHandler
  implements IQueryHandler<FindPatientByIdQuery, PatientDto>
{
  private readonly logger = new Logger(FindPatientByIdHandler.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  /**
   * Executes the find patient by ID query.
   * @param {FindPatientByIdQuery} query - The query containing the patient ID.
   * @returns {Promise<PatientDto>} The patient data as a DTO.
   * @throws {PatientNotFoundException} If the patient with the specified ID is not found.
   * @throws {ForbiddenException} If the user is not authorized to view this patient (example placeholder).
   * @throws {Error} If any other error occurs during the retrieval process.
   */
  async execute(query: FindPatientByIdQuery): Promise<PatientDto> {
    const { patientId } = query;
    this.logger.log(`Executing FindPatientByIdQuery for ID: ${patientId}`);
    try {
      const patient: Patient | null =
        await this.patientRepository.findById(patientId);
      if (!patient) {
        this.logger.warn(`Patient with ID ${patientId} not found.`);
        throw new PatientNotFoundException(patientId);
      }
      const patientDto: PatientDto = this.patientMapper.toDto(patient);

      this.logger.log(`Found patient with ID: ${patientId}`);
      return patientDto;
    } catch (error) {
      if (
        error instanceof PatientNotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(
        `Error executing FindPatientByIdQuery for ID ${patientId}: ${error.message}`,
        error.stack,
      );
      throw new Error(
        `Failed to retrieve patient with ID ${patientId}: ${error.message}`,
      );
    }
  }
}
