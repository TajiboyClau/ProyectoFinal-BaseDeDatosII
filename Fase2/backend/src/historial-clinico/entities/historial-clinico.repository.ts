import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { HistorialClinico } from './historial-clinico.entity.js';
import { Paciente } from '../../paciente/entities/paciente.entity.js';

@Injectable()
export class HistorialClinicoRepositorio {
  constructor(
    @InjectRepository(HistorialClinico)
    private readonly repo: Repository<HistorialClinico>,
  ) {}

  findAll(): Promise<HistorialClinico[]> {
    return this.repo.find({ order: { idHistorial: 'ASC' } });
  }

  findById(idHistorial: number): Promise<HistorialClinico | null> {
    return this.repo.findOneBy({ idHistorial });
  }

  async create(data: Partial<HistorialClinico>): Promise<HistorialClinico> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<HistorialClinico>,
    );
  }

  async update(
    idHistorial: number,
    data: Partial<HistorialClinico>,
  ): Promise<HistorialClinico | null> {
    const resultado = await this.repo.update({ idHistorial }, data);
    if (!resultado.affected) return null;
    return this.findById(idHistorial);
  }

  async delete(idHistorial: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idHistorial });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<HistorialClinico>): Promise<void> {
    if (
      data.pacienteId !== undefined &&
      data.pacienteId !== null &&
      !(await this.repo.manager.existsBy(Paciente, {
        idPaciente: data.pacienteId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia paciente_id');
    }
  }
}
