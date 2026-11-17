import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Venta } from './venta.entity.js';
import { Paciente } from '../../paciente/entities/paciente.entity.js';
import { TipoPago } from '../../tipo-pago/entities/tipo-pago.entity.js';

@Injectable()
export class VentaRepositorio {
  constructor(
    @InjectRepository(Venta) private readonly repo: Repository<Venta>,
  ) {}

  findAll(): Promise<Venta[]> {
    return this.repo.find({ order: { idVenta: 'ASC' } });
  }

  findById(idVenta: number): Promise<Venta | null> {
    return this.repo.findOneBy({ idVenta });
  }

  async create(data: Partial<Venta>): Promise<Venta> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Venta>,
    );
  }

  async update(idVenta: number, data: Partial<Venta>): Promise<Venta | null> {
    const resultado = await this.repo.update({ idVenta }, data);
    if (!resultado.affected) return null;
    return this.findById(idVenta);
  }

  async delete(idVenta: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idVenta });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Venta>): Promise<void> {
    if (
      data.pacienteId !== undefined &&
      data.pacienteId !== null &&
      !(await this.repo.manager.existsBy(Paciente, {
        idPaciente: data.pacienteId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia paciente_id');
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
