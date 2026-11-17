import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Enfermero } from './enfermero.entity.js';

@Injectable()
export class EnfermeroRepositorio {
  constructor(
    @InjectRepository(Enfermero) private readonly repo: Repository<Enfermero>,
  ) {}

  findAll(): Promise<Enfermero[]> {
    return this.repo.find({ order: { enfermeroId: 'ASC' } });
  }

  findById(enfermeroId: number): Promise<Enfermero | null> {
    return this.repo.findOneBy({ enfermeroId });
  }

  async create(data: Partial<Enfermero>): Promise<Enfermero> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Enfermero>,
    );
  }

  async update(
    enfermeroId: number,
    data: Partial<Enfermero>,
  ): Promise<Enfermero | null> {
    const resultado = await this.repo.update({ enfermeroId }, data);
    if (!resultado.affected) return null;
    return this.findById(enfermeroId);
  }

  async delete(enfermeroId: number): Promise<boolean> {
    const resultado = await this.repo.delete({ enfermeroId });
    return (resultado.affected ?? 0) > 0;
  }
}
