export const AI_DIAGNOSIS_SERVICE = Symbol('AI_DIAGNOSIS_SERVICE');

export interface IAiDiagnosisService {
  /**
   * Generates a suggested diagnosis based on provided medical history.
   * @param medicalHistory An array of strings representing the patient's medical history entries.
   * @returns {Promise<string>} A string containing the suggested diagnosis.
   * @throws {Error} If the AI service fails to generate a suggestion.
   */
  suggestDiagnosis(medicalHistory: string[]): Promise<string>;
}
