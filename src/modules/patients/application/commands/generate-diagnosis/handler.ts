import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { GenerateDiagnosisCommand } from './command';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientNotFoundException } from '../../../domain/exceptions/patient-not-found.exception';
import {
  AI_DIAGNOSIS_SERVICE,
  IAiDiagnosisService,
} from 'src/modules/patients/domain/interfaces/ai-diagnosis.service.interface';

// Define the expected response structure
interface DiagnosisResponse {
  patientId: string;
  medicalHistory: string[];
  suggestedDiagnosis: string;
}

@Injectable()
@CommandHandler(GenerateDiagnosisCommand)
export class GenerateDiagnosisHandler
  implements ICommandHandler<GenerateDiagnosisCommand, DiagnosisResponse>
{
  private readonly logger = new Logger(GenerateDiagnosisHandler.name);

  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(AI_DIAGNOSIS_SERVICE)
    private readonly aiDiagnosisService: IAiDiagnosisService,
  ) {}

  /**
   * Executes the generate diagnosis command.
   * @param {GenerateDiagnosisCommand} command - The command containing the patient ID.
   * @returns {Promise<DiagnosisResponse>} An object containing the diagnosis suggestion.
   * @throws {PatientNotFoundException} If the patient is not found.
   * @throws {Error} If the AI service fails.
   */
  async execute(command: GenerateDiagnosisCommand): Promise<DiagnosisResponse> {
    const { patientId } = command;
    this.logger.log(`Generating AI diagnosis for patient ID: ${patientId}`);

    const patient = await this.patientRepository.findById(patientId);
    if (!patient) {
      this.logger.warn(
        `Patient with ID ${patientId} not found for AI diagnosis.`,
      );
      throw new PatientNotFoundException(patientId);
    }

    if (!patient.medicalHistory || patient.medicalHistory.length === 0) {
      this.logger.log(`Patient ${patientId} has no medical history.`);
      return {
        patientId: patientId,
        medicalHistory: [],
        suggestedDiagnosis:
          'El paciene aun no tiene historia medica registrada',
      };
    }

    try {
      const suggestion = await this.aiDiagnosisService.suggestDiagnosis(
        patient.medicalHistory,
      );

      return {
        patientId: patient.id,
        medicalHistory: patient.medicalHistory,
        suggestedDiagnosis: suggestion,
      };
    } catch (error) {
      this.logger.error(
        `AI Diagnosis Service failed for patient ${patientId}: ${error.message}`,
      );

      throw error;
    }
  }
}
