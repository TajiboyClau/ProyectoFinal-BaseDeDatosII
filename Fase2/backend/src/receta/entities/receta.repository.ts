import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Receta } from './receta.entity.js';
import { Consulta } from '../../consulta/entities/consulta.entity.js';

@Injectable()
export class RecetaRepositorio {
  constructor(
    @InjectRepository(Receta) private readonly repo: Repository<Receta>,
  ) {}

  findAll(): Promise<Receta[]> {
    return this.repo.find({ order: { idReceta: 'ASC' } });
  }

  findById(idReceta: number): Promise<Receta | null> {
    return this.repo.findOneBy({ idReceta });
  }

  async create(data: Partial<Receta>): Promise<Receta> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Receta>,
    );
  }

  async update(
    idReceta: number,
    data: Partial<Receta>,
  ): Promise<Receta | null> {
    const resultado = await this.repo.update({ idReceta }, data);
    if (!resultado.affected) return null;
    return this.findById(idReceta);
  }

  async delete(idReceta: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idReceta });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Receta>): Promise<void> {
    if (
      data.consultaId !== undefined &&
      data.consultaId !== null &&
      !(await this.repo.manager.existsBy(Consulta, {
        idConsulta: data.consultaId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia consulta_id');
    }
  }
}
