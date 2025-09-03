import { CreatePatientDto } from '../../dtos/create-patient.dto';

export class CreatePatientCommand {
  constructor(public readonly dto: CreatePatientDto) {}
}
