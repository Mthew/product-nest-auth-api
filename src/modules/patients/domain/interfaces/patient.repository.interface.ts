import { Patient } from '../entities/patient.entity';

export const PATIENT_REPOSITORY = Symbol('PATIENT_REPOSITORY');
export interface IPatientRepository {
  save(patient: Patient): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findAll(): Promise<Patient[]>;
  update(id: string, patient: Partial<Patient>): Promise<Patient | null>;
  delete(id: string): Promise<boolean>;
}
