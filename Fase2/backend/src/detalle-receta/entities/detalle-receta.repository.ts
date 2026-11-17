import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { DetalleReceta } from './detalle-receta.entity.js';
import { Receta } from '../../receta/entities/receta.entity.js';
import { Producto } from '../../producto/entities/producto.entity.js';

@Injectable()
export class DetalleRecetaRepositorio {
  constructor(
    @InjectRepository(DetalleReceta)
    private readonly repo: Repository<DetalleReceta>,
  ) {}

  findAll(): Promise<DetalleReceta[]> {
    return this.repo.find({ order: { idReceta: 'ASC', idProducto: 'ASC' } });
  }

  findById(
    idReceta: number,
    idProducto: number,
  ): Promise<DetalleReceta | null> {
    return this.repo.findOneBy({ idReceta, idProducto });
  }

  async create(data: Partial<DetalleReceta>): Promise<DetalleReceta> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<DetalleReceta>,
    );
  }

  async update(
    idReceta: number,
    idProducto: number,
    data: Partial<DetalleReceta>,
  ): Promise<DetalleReceta | null> {
    const resultado = await this.repo.update({ idReceta, idProducto }, data);
    if (!resultado.affected) return null;
    return this.findById(idReceta, idProducto);
  }

  async delete(idReceta: number, idProducto: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idReceta, idProducto });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<DetalleReceta>): Promise<void> {
    if (
      data.idReceta !== undefined &&
      data.idReceta !== null &&
      !(await this.repo.manager.existsBy(Receta, { idReceta: data.idReceta }))
    ) {
      throw new BadRequestException('No existe la referencia id_receta');
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
