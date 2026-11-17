import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Paciente } from './paciente.entity.js';

@Injectable()
export class PacienteRepositorio {
  constructor(
    @InjectRepository(Paciente) private readonly repo: Repository<Paciente>,
  ) {}

  findAll(): Promise<Paciente[]> {
    return this.repo.find({ order: { idPaciente: 'ASC' } });
  }

  findById(idPaciente: number): Promise<Paciente | null> {
    return this.repo.findOneBy({ idPaciente });
  }

  async create(data: Partial<Paciente>): Promise<Paciente> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Paciente>,
    );
  }

  async update(
    idPaciente: number,
    data: Partial<Paciente>,
  ): Promise<Paciente | null> {
    const resultado = await this.repo.update({ idPaciente }, data);
    if (!resultado.affected) return null;
    return this.findById(idPaciente);
  }

  async delete(idPaciente: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idPaciente });
    return (resultado.affected ?? 0) > 0;
  }
}
