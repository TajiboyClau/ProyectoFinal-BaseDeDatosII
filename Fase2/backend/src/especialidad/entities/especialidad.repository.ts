import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Especialidad } from './especialidad.entity.js';

@Injectable()
export class EspecialidadRepositorio {
  constructor(
    @InjectRepository(Especialidad)
    private readonly repo: Repository<Especialidad>,
  ) {}

  findAll(): Promise<Especialidad[]> {
    return this.repo.find({ order: { idEspecialidad: 'ASC' } });
  }

  findById(idEspecialidad: number): Promise<Especialidad | null> {
    return this.repo.findOneBy({ idEspecialidad });
  }

  async create(data: Partial<Especialidad>): Promise<Especialidad> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Especialidad>,
    );
  }

  async update(
    idEspecialidad: number,
    data: Partial<Especialidad>,
  ): Promise<Especialidad | null> {
    const resultado = await this.repo.update({ idEspecialidad }, data);
    if (!resultado.affected) return null;
    return this.findById(idEspecialidad);
  }

  async delete(idEspecialidad: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idEspecialidad });
    return (resultado.affected ?? 0) > 0;
  }
}
