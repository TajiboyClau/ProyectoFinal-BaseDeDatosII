import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity.js';
import { Venta } from '../../venta/entities/venta.entity.js';
import { Producto } from '../../producto/entities/producto.entity.js';

@Injectable()
export class DetalleVentaRepositorio {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly repo: Repository<DetalleVenta>,
  ) {}

  findAll(): Promise<DetalleVenta[]> {
    return this.repo.find({ order: { idVenta: 'ASC', idProducto: 'ASC' } });
  }

  findById(idVenta: number, idProducto: number): Promise<DetalleVenta | null> {
    return this.repo.findOneBy({ idVenta, idProducto });
  }

  async create(data: Partial<DetalleVenta>): Promise<DetalleVenta> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<DetalleVenta>,
    );
  }

  async update(
    idVenta: number,
    idProducto: number,
    data: Partial<DetalleVenta>,
  ): Promise<DetalleVenta | null> {
    const resultado = await this.repo.update({ idVenta, idProducto }, data);
    if (!resultado.affected) return null;
    return this.findById(idVenta, idProducto);
  }

  async delete(idVenta: number, idProducto: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idVenta, idProducto });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<DetalleVenta>): Promise<void> {
    if (
      data.idVenta !== undefined &&
      data.idVenta !== null &&
      !(await this.repo.manager.existsBy(Venta, { idVenta: data.idVenta }))
    ) {
      throw new BadRequestException('No existe la referencia id_venta');
    }
    if (
      data.idProducto !== undefined &&
      data.idProducto !== null &&
      !(await this.repo.manager.existsBy(Producto, {
        idProducto: data.idProducto,
      }))
    ) {
      throw new BadRequestException('No existe la referencia id_producto');
    }
  }
}
