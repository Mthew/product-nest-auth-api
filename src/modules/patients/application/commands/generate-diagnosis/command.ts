/**
 * @fileoverview Defines the command for generating an AI diagnosis suggestion.
 */
export class GenerateDiagnosisCommand {
  /**
   * Creates an instance of GenerateDiagnosisCommand.
   * @param {string} patientId The unique identifier of the patient.
   */
  constructor(public readonly patientId: string) {}
}
