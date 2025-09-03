import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { PatientController } from './presentation/http/patient.controller';
import { Patient } from './domain/entities/patient.entity';
import { TypeOrmPatientRepository } from './infrastructure/persistence/typeorm/typeorm-patient.repository';
import { PATIENT_REPOSITORY } from './domain/interfaces/patient.repository.interface';
//import { PatientRepositoryProvider } from './infrastructure/persistence/patient.repository.provider';

// --- Import Handlers ---
import { CreatePatientHandler } from './application/commands/create-patient/handler';
import { FindAllPatientsHandler } from './application/queries/find-all/handler';
import { FindPatientByIdHandler } from './application/queries/find-by-id/handler';
import { UpdatePatientHandler } from './application/commands/update-patient/handler';
import { DeletePatientHandler } from './application/commands/delete-patient/handler';
import { GenerateDiagnosisHandler } from './application/commands/generate-diagnosis/handler';

// --- Import Services ---
import { PatientMapper } from './application/services/patient.mapper';

// --- Import AI Services and Provider ---
import { AiServiceProvider } from './infrastructure/ai/ai-service.provider';

// --- Group Handlers ---
const CommandHandlers = [
  CreatePatientHandler,
  UpdatePatientHandler,
  DeletePatientHandler,
  GenerateDiagnosisHandler,
];
const QueryHandlers = [FindAllPatientsHandler, FindPatientByIdHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Patient]), ConfigModule],
  controllers: [PatientController],
  providers: [
    TypeOrmPatientRepository,
    {
      provide: PATIENT_REPOSITORY,
      useExisting: TypeOrmPatientRepository,
    },
    PatientMapper,
    ...CommandHandlers,
    ...QueryHandlers,
    AiServiceProvider,
  ],
  exports: [PATIENT_REPOSITORY],
})
export class PatientsModule {}
