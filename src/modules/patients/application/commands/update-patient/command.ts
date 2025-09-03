import { UpdatePatientDto } from '../../dtos/update-patient.dto';

export class UpdatePatientCommand {
  constructor(
    public readonly id: string,
    public readonly dto: UpdatePatientDto,
  ) {}
}
