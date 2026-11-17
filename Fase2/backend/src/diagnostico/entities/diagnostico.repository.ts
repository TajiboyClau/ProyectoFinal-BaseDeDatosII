import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Diagnostico } from './diagnostico.entity.js';
import { Consulta } from '../../consulta/entities/consulta.entity.js';

@Injectable()
export class DiagnosticoRepositorio {
  constructor(
    @InjectRepository(Diagnostico)
    private readonly repo: Repository<Diagnostico>,
  ) {}

  findAll(): Promise<Diagnostico[]> {
    return this.repo.find({ order: { idDiagnostico: 'ASC' } });
  }

  findById(idDiagnostico: number): Promise<Diagnostico | null> {
    return this.repo.findOneBy({ idDiagnostico });
  }

  async create(data: Partial<Diagnostico>): Promise<Diagnostico> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Diagnostico>,
    );
  }

  async update(
    idDiagnostico: number,
    data: Partial<Diagnostico>,
  ): Promise<Diagnostico | null> {
    const resultado = await this.repo.update({ idDiagnostico }, data);
    if (!resultado.affected) return null;
    return this.findById(idDiagnostico);
  }

  async delete(idDiagnostico: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idDiagnostico });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Diagnostico>): Promise<void> {
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
