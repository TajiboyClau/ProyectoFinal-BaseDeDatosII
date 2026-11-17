import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Doctor } from './doctor.entity.js';
import { Especialidad } from '../../especialidad/entities/especialidad.entity.js';

@Injectable()
export class DoctorRepositorio {
  constructor(
    @InjectRepository(Doctor) private readonly repo: Repository<Doctor>,
  ) {}

  findAll(): Promise<Doctor[]> {
    return this.repo.find({ order: { doctorId: 'ASC' } });
  }

  findById(doctorId: number): Promise<Doctor | null> {
    return this.repo.findOneBy({ doctorId });
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Doctor>,
    );
  }

  async update(
    doctorId: number,
    data: Partial<Doctor>,
  ): Promise<Doctor | null> {
    const resultado = await this.repo.update({ doctorId }, data);
    if (!resultado.affected) return null;
    return this.findById(doctorId);
  }

  async delete(doctorId: number): Promise<boolean> {
    const resultado = await this.repo.delete({ doctorId });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Doctor>): Promise<void> {
    if (
      data.doctorEspecialidad !== undefined &&
      data.doctorEspecialidad !== null &&
      !(await this.repo.manager.existsBy(Especialidad, {
        idEspecialidad: data.doctorEspecialidad,
      }))
    ) {
      throw new BadRequestException(
        'No existe la referencia doctor_especialidad',
      );
    }
  }
}
