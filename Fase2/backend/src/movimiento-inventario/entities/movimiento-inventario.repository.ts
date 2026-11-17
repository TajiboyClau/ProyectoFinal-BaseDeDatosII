import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { MovimientoInventario } from './movimiento-inventario.entity.js';
import { Producto } from '../../producto/entities/producto.entity.js';

@Injectable()
export class MovimientoInventarioRepositorio {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly repo: Repository<MovimientoInventario>,
  ) {}

  findAll(): Promise<MovimientoInventario[]> {
    return this.repo.find({ order: { idMovimiento: 'ASC' } });
  }

  findById(idMovimiento: number): Promise<MovimientoInventario | null> {
    return this.repo.findOneBy({ idMovimiento });
  }

  async create(
    data: Partial<MovimientoInventario>,
  ): Promise<MovimientoInventario> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<MovimientoInventario>,
    );
  }

  async update(
    idMovimiento: number,
    data: Partial<MovimientoInventario>,
  ): Promise<MovimientoInventario | null> {
    const resultado = await this.repo.update({ idMovimiento }, data);
    if (!resultado.affected) return null;
    return this.findById(idMovimiento);
  }

  async delete(idMovimiento: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idMovimiento });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<MovimientoInventario>): Promise<void> {
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
