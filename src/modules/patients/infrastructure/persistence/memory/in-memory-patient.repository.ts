import { Injectable } from '@nestjs/common';

import { Patient } from 'src/modules/patients/domain/entities/patient.entity';
import { IPatientRepository } from 'src/modules/patients/domain/interfaces/patient.repository.interface';

@Injectable()
export class InMemoryPatientRepository implements IPatientRepository {
  private readonly patients: Map<string, Patient> = new Map();

  async save(patient: Patient): Promise<Patient> {
    this.patients.set(patient.id, patient);
    console.log(`Saved patient: ${patient.id}, Total: ${this.patients.size}`);
    return patient;
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = this.patients.get(id);
    return patient ? patient : null;
  }

  async findAll(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  async update(
    id: string,
    patientData: Partial<Patient>,
  ): Promise<Patient | null> {
    const existingPatient = this.patients.get(id);
    if (!existingPatient) {
      return null;
    }
    const updatedPatient = new Patient({
      firstName: existingPatient.firstName,
      lastName: existingPatient.lastName,
      birthDate: existingPatient.birthDate,
      medicalHistory: existingPatient.medicalHistory,
      ...patientData,
    });

    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async delete(id: string): Promise<boolean> {
    const deleted = this.patients.delete(id);
    console.log(
      `Deleted patient: ${id}, Success: ${deleted}, Remaining: ${this.patients.size}`,
    );
    return deleted;
  }
}
