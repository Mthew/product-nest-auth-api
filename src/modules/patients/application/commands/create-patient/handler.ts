import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'; // Install @nestjs/cqrs if using
import { Inject, Injectable } from '@nestjs/common';
import { CreatePatientCommand } from './command';
import {
  IPatientRepository,
  PATIENT_REPOSITORY,
} from '../../../domain/interfaces/patient.repository.interface';
import { PatientMapper } from '../../services/patient.mapper';
import { PatientDto } from '../../dtos/patient.dto';

@Injectable()
@CommandHandler(CreatePatientCommand)
export class CreatePatientHandler
  implements ICommandHandler<CreatePatientCommand, PatientDto>
{
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    private readonly patientMapper: PatientMapper,
  ) {}

  async execute(command: CreatePatientCommand): Promise<PatientDto> {
    const { dto } = command;
    const newPatientEntity = this.patientMapper.createDtoToEntity(dto);
    const savedPatient = await this.patientRepository.save(newPatientEntity);
    return this.patientMapper.toDto(savedPatient);
  }
}
