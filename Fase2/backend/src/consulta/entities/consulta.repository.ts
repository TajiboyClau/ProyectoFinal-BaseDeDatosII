import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Consulta } from './consulta.entity.js';
import { Cita } from '../../cita/entities/cita.entity.js';

@Injectable()
export class ConsultaRepositorio {
  constructor(
    @InjectRepository(Consulta) private readonly repo: Repository<Consulta>,
  ) {}

  findAll(): Promise<Consulta[]> {
    return this.repo.find({ order: { idConsulta: 'ASC' } });
  }

  findById(idConsulta: number): Promise<Consulta | null> {
    return this.repo.findOneBy({ idConsulta });
  }

  async create(data: Partial<Consulta>): Promise<Consulta> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Consulta>,
    );
  }

  async update(
    idConsulta: number,
    data: Partial<Consulta>,
  ): Promise<Consulta | null> {
    const resultado = await this.repo.update({ idConsulta }, data);
    if (!resultado.affected) return null;
    return this.findById(idConsulta);
  }

  async delete(idConsulta: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idConsulta });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Consulta>): Promise<void> {
    if (
      data.citaId !== undefined &&
      data.citaId !== null &&
      !(await this.repo.manager.existsBy(Cita, { idCita: data.citaId }))
    ) {
      throw new BadRequestException('No existe la referencia cita_id');
    }
  }
}
