import { Injectable, Logger } from '@nestjs/common';
import { IAiDiagnosisService } from '../../domain/interfaces/ai-diagnosis.service.interface';

@Injectable()
export class SimulatedDiagnosisService implements IAiDiagnosisService {
  private readonly logger = new Logger(SimulatedDiagnosisService.name);

  async suggestDiagnosis(medicalHistory: string[]): Promise<string> {
    this.logger.log(
      `Simulating diagnosis for history: ${medicalHistory.join(', ')}`,
    );

    const historyText = medicalHistory.join(' ').toLowerCase();
    let suggestion =
      'Se recomienda chequeo general. No se detectaron palabras clave que indiquen un diagnóstico específico.';

    if (
      medicalHistory.includes('cabeza') &&
      medicalHistory.includes('fiebre')
    ) {
      suggestion =
        'Posible infección viral o gripe. Se recomienda realizar pruebas adicionales.';
    } else if (
      medicalHistory.includes('tos') &&
      medicalHistory.includes('congestión')
    ) {
      suggestion =
        'Sugiere una infección respiratoria alta. Considerar tratamiento sintomático.';
    } else if (medicalHistory.includes('dolor en el pecho')) {
      suggestion =
        'Se detectó dolor en el pecho. Se recomienda evaluación cardiológica urgente.';
    } else if (medicalHistory.includes('alergia')) {
      suggestion =
        'Síntomas de alergia detectados. Se recomienda realizar pruebas de alergia y revisar posibles desencadenantes.';
    } else if (medicalHistory.includes('asma')) {
      suggestion =
        'Se menciona historial de asma. Evaluar control actual y adherencia al tratamiento.';
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    this.logger.log(`Simulated suggestion: ${suggestion}`);
    return suggestion;
  }
}
