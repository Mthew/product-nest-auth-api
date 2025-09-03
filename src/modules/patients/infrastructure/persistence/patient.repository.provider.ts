import { Provider } from '@nestjs/common';
import { PATIENT_REPOSITORY } from '../../domain/interfaces/patient.repository.interface';
import { TypeOrmPatientRepository } from './typeorm/typeorm-patient.repository';
//import { InMemoryPatientRepository } from './memory/in-memory-patient.repository';

export const PatientRepositoryProvider: Provider = {
  provide: PATIENT_REPOSITORY,
  useClass: TypeOrmPatientRepository,
};
