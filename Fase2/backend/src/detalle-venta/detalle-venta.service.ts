import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DetalleVentaRepositorio } from './entities/detalle-venta.repository.js';
import { DetalleVenta } from './entities/detalle-venta.entity.js';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto.js';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto.js';

@Injectable()
export class DetalleVentaService {
  constructor(private readonly repositorio: DetalleVentaRepositorio) {}

  findAll(): Promise<DetalleVenta[]> {
    return this.repositorio.findAll();
  }

  async findById(idVenta: number, idProducto: number): Promise<DetalleVenta> {
    const registro = await this.repositorio.findById(idVenta, idProducto);
    if (!registro)
      throw new NotFoundException('Registro de detalle_venta no encontrado');
    return registro;
  }

  async create(dto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(
    idVenta: number,
    idProducto: number,
    dto: UpdateDetalleVentaDto,
  ): Promise<DetalleVenta> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idVenta, idProducto);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idVenta, idProducto, data);
    if (!registro)
      throw new NotFoundException('Registro de detalle_venta no encontrado');
    return registro;
  }

  async delete(
    idVenta: number,
    idProducto: number,
  ): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idVenta, idProducto))) {
      throw new NotFoundException('Registro de detalle_venta no encontrado');
    }
    return { message: 'Registro de detalle_venta eliminado' };
  }

  private convertir(
    dto: CreateDetalleVentaDto | UpdateDetalleVentaDto,
  ): Partial<DetalleVenta> {
    const data: Partial<DetalleVenta> = {};
    if ('idVenta' in dto && dto.idVenta !== undefined)
      data.idVenta = dto.idVenta;
    if ('idProducto' in dto && dto.idProducto !== undefined)
      data.idProducto = dto.idProducto;
    if ('detalleVentaCantidad' in dto && dto.detalleVentaCantidad !== undefined)
      data.detalleVentaCantidad =
        dto.detalleVentaCantidad === null
          ? null
          : dto.detalleVentaCantidad.toFixed(2);
    if ('detalleVentaPrecio' in dto && dto.detalleVentaPrecio !== undefined)
      data.detalleVentaPrecio =
        dto.detalleVentaPrecio === null
          ? null
          : dto.detalleVentaPrecio.toFixed(2);
    if (
      'detalleVentaDescuento' in dto &&
      dto.detalleVentaDescuento !== undefined
    )
      data.detalleVentaDescuento =
        dto.detalleVentaDescuento === null
          ? null
          : dto.detalleVentaDescuento.toFixed(2);
    return data;
  }
}
