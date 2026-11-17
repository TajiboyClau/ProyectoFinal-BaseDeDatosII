import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Pagos } from './pagos.entity.js';
import { Cita } from '../../cita/entities/cita.entity.js';
import { TipoPago } from '../../tipo-pago/entities/tipo-pago.entity.js';

@Injectable()
export class PagosRepositorio {
  constructor(
    @InjectRepository(Pagos) private readonly repo: Repository<Pagos>,
  ) {}

  findAll(): Promise<Pagos[]> {
    return this.repo.find({ order: { idPago: 'ASC' } });
  }

  findById(idPago: number): Promise<Pagos | null> {
    return this.repo.findOneBy({ idPago });
  }

  async create(data: Partial<Pagos>): Promise<Pagos> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Pagos>,
    );
  }

  async update(idPago: number, data: Partial<Pagos>): Promise<Pagos | null> {
    const resultado = await this.repo.update({ idPago }, data);
    if (!resultado.affected) return null;
    return this.findById(idPago);
  }

  async delete(idPago: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idPago });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Pagos>): Promise<void> {
    if (
      data.citaId !== undefined &&
      data.citaId !== null &&
      !(await this.repo.manager.existsBy(Cita, { idCita: data.citaId }))
    ) {
      throw new BadRequestException('No existe la referencia cita_id');
    }
    if (
      data.tipoPagoId !== undefined &&
      data.tipoPagoId !== null &&
      !(await this.repo.manager.existsBy(TipoPago, {
        idTipoPago: data.tipoPagoId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia tipo_pago_id');
    }
  }
}
