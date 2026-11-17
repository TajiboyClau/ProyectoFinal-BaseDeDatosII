import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MovimientoInventarioRepositorio } from './entities/movimiento-inventario.repository.js';
import { MovimientoInventario } from './entities/movimiento-inventario.entity.js';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto.js';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento-inventario.dto.js';

@Injectable()
export class MovimientoInventarioService {
  constructor(private readonly repositorio: MovimientoInventarioRepositorio) {}

  findAll(): Promise<MovimientoInventario[]> {
    return this.repositorio.findAll();
  }

  async findById(idMovimiento: number): Promise<MovimientoInventario> {
    const registro = await this.repositorio.findById(idMovimiento);
    if (!registro)
      throw new NotFoundException(
        'Registro de movimiento_inventario no encontrado',
      );
    return registro;
  }

  async create(
    dto: CreateMovimientoInventarioDto,
  ): Promise<MovimientoInventario> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(
    idMovimiento: number,
    dto: UpdateMovimientoInventarioDto,
  ): Promise<MovimientoInventario> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idMovimiento);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idMovimiento, data);
    if (!registro)
      throw new NotFoundException(
        'Registro de movimiento_inventario no encontrado',
      );
    return registro;
  }

  async delete(idMovimiento: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idMovimiento))) {
      throw new NotFoundException(
        'Registro de movimiento_inventario no encontrado',
      );
    }
    return { message: 'Registro de movimiento_inventario eliminado' };
  }

  private convertir(
    dto: CreateMovimientoInventarioDto | UpdateMovimientoInventarioDto,
  ): Partial<MovimientoInventario> {
    const data: Partial<MovimientoInventario> = {};
    if ('idProducto' in dto && dto.idProducto !== undefined)
      data.idProducto = dto.idProducto;
    if ('tipoMovimiento' in dto && dto.tipoMovimiento !== undefined)
      data.tipoMovimiento = dto.tipoMovimiento;
    if ('cantidad' in dto && dto.cantidad !== undefined)
      data.cantidad = dto.cantidad === null ? null : dto.cantidad.toFixed(2);
    if ('fechaMovimiento' in dto && dto.fechaMovimiento !== undefined)
      data.fechaMovimiento =
        dto.fechaMovimiento === null ? null : new Date(dto.fechaMovimiento);
    return data;
  }
}
