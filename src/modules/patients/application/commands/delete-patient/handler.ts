import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable } from '@nestjs/common';
import { DeletePatientCommand } from './command';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientNotFoundException } from '../../../domain/exceptions/patient-not-found.exception';
import { Logger } from '@nestjs/common';

@Injectable()
@CommandHandler(DeletePatientCommand)
export class DeletePatientHandler
  implements ICommandHandler<DeletePatientCommand, boolean>
{
  private readonly logger = new Logger(DeletePatientHandler.name); // Optional logger

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
  ) {}

  /**
   * Executes the delete patient command.
   * @param {DeletePatientCommand} command - The command containing the patient ID.
   * @returns {Promise<boolean>} Returns true if deletion was successful.
   * @throws {PatientNotFoundException} If the patient with the specified ID does not exist.
   * @throws {Error} If any other error occurs during the deletion process.
   */
  async execute(command: DeletePatientCommand): Promise<boolean> {
    const { id } = command;
    this.logger.log(`Attempting to delete patient with ID: ${id}`);

    try {
      const deleted = await this.patientRepository.delete(id);

      if (!deleted) {
        this.logger.warn(`Patient with ID ${id} not found for deletion.`);
        throw new PatientNotFoundException(id);
      }

      this.logger.log(`Successfully deleted patient with ID: ${id}`);
      return true;
    } catch (error) {
      if (error instanceof PatientNotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error deleting patient with ID ${id}: ${error.message}`,
        error.stack,
      );
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
  }
}
