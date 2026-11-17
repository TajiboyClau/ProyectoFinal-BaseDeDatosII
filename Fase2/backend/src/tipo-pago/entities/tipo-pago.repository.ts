import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { TipoPago } from './tipo-pago.entity.js';

@Injectable()
export class TipoPagoRepositorio {
  constructor(
    @InjectRepository(TipoPago) private readonly repo: Repository<TipoPago>,
  ) {}

  findAll(): Promise<TipoPago[]> {
    return this.repo.find({ order: { idTipoPago: 'ASC' } });
  }

  findById(idTipoPago: number): Promise<TipoPago | null> {
    return this.repo.findOneBy({ idTipoPago });
  }

  async create(data: Partial<TipoPago>): Promise<TipoPago> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<TipoPago>,
    );
  }

  async update(
    idTipoPago: number,
    data: Partial<TipoPago>,
  ): Promise<TipoPago | null> {
    const resultado = await this.repo.update({ idTipoPago }, data);
    if (!resultado.affected) return null;
    return this.findById(idTipoPago);
  }

  async delete(idTipoPago: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idTipoPago });
    return (resultado.affected ?? 0) > 0;
  }
}
