import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../../../domain/entities/patient.entity';
import { IPatientRepository } from '../../../domain/interfaces/patient.repository.interface';

@Injectable()
export class TypeOrmPatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly ormRepository: Repository<Patient>,
  ) {}

  async save(patient: Patient): Promise<Patient> {
    return this.ormRepository.save(patient);
  }

  async findById(id: string): Promise<Patient | null> {
    const patient = await this.ormRepository.findOneBy({ id });
    return patient;
  }

  async findAll(): Promise<Patient[]> {
    return this.ormRepository.find();
  }

  async update(
    id: string,
    patientData: Partial<Patient>,
  ): Promise<Patient | null> {
    const result = await this.ormRepository.update(id, patientData);
    if (result.affected === 0) {
      return null;
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
