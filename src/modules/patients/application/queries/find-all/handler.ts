import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FindAllPatientsQuery } from './query';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientMapper } from '../../services/patient.mapper';
import { PatientDto } from '../../dtos/patient.dto';
import { Patient } from '../../../domain/entities/patient.entity';

@Injectable()
@QueryHandler(FindAllPatientsQuery)
export class FindAllPatientsHandler
  implements IQueryHandler<FindAllPatientsQuery, PatientDto[]>
{
  private readonly logger = new Logger(FindAllPatientsHandler.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  /**
   * Executes the find all patients query.
   * @param {FindAllPatientsQuery} query - The query object (unused in this case).
   * @returns {Promise<PatientDto[]>} An array of patient DTOs.
   * @throws {Error} If any error occurs during the retrieval process.
   */
  async execute(query: FindAllPatientsQuery): Promise<PatientDto[]> {
    this.logger.log('Executing FindAllPatientsQuery');

    try {
      const patients: Patient[] = await this.patientRepository.findAll();
      const patientDtos: PatientDto[] = this.patientMapper.toDtoList(patients);

      this.logger.log(`Found ${patientDtos.length} patients.`);
      return patientDtos;
    } catch (error) {
      this.logger.error(
        `Error executing FindAllPatientsQuery: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to retrieve patients: ${error.message}`);
    }
  }
}
