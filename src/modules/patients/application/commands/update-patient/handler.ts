import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger, ForbiddenException } from '@nestjs/common'; // Added Logger, ForbiddenException
import { UpdatePatientCommand } from './command';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientNotFoundException } from '../../../domain/exceptions/patient-not-found.exception';
import { PatientMapper } from '../../services/patient.mapper';
import { PatientDto } from '../../dtos/patient.dto';
// import { Role } from '../../../../users/domain/entities/role.enum'; // If checking roles here

@Injectable()
@CommandHandler(UpdatePatientCommand)
export class UpdatePatientHandler
  implements ICommandHandler<UpdatePatientCommand, PatientDto>
{
  private readonly logger = new Logger(UpdatePatientHandler.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  /**
   * Executes the update patient command.
   * @param {UpdatePatientCommand} command - The command containing the patient ID and update data.
   * @returns {Promise<PatientDto>} The updated patient data as a DTO.
   * @throws {PatientNotFoundException} If the patient with the specified ID does not exist.
   * @throws {ForbiddenException} If the user is not authorized to update this patient (example placeholder).
   * @throws {Error} If any other error occurs during the update process.
   */
  async execute(command: UpdatePatientCommand): Promise<PatientDto> {
    const { id, dto } = command;
    this.logger.log(`Attempting to update patient with ID: ${id}`);

    try {
      const existingPatient = await this.patientRepository.findById(id);

      if (!existingPatient) {
        this.logger.warn(`Patient with ID ${id} not found for update.`);
        throw new PatientNotFoundException(id);
      }

      const updateData = {
        ...dto,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      };
      existingPatient.updateInfo(updateData);

      const savedPatient = await this.patientRepository.save(existingPatient);
      this.logger.log(`Successfully updated patient with ID: ${id}`);

      return this.patientMapper.toDto(savedPatient);
    } catch (error) {
      if (
        error instanceof PatientNotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      this.logger.error(
        `Error updating patient with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }
}
