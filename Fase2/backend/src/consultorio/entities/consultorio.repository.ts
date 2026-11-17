import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Consultorio } from './consultorio.entity.js';

@Injectable()
export class ConsultorioRepositorio {
  constructor(
    @InjectRepository(Consultorio)
    private readonly repo: Repository<Consultorio>,
  ) {}

  findAll(): Promise<Consultorio[]> {
    return this.repo.find({ order: { idConsultorio: 'ASC' } });
  }

  findById(idConsultorio: number): Promise<Consultorio | null> {
    return this.repo.findOneBy({ idConsultorio });
  }

  async create(data: Partial<Consultorio>): Promise<Consultorio> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Consultorio>,
    );
  }

  async update(
    idConsultorio: number,
    data: Partial<Consultorio>,
  ): Promise<Consultorio | null> {
    const resultado = await this.repo.update({ idConsultorio }, data);
    if (!resultado.affected) return null;
    return this.findById(idConsultorio);
  }

  async delete(idConsultorio: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idConsultorio });
    return (resultado.affected ?? 0) > 0;
  }
}
