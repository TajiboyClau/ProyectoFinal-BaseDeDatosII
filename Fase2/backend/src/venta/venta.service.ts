import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VentaRepositorio } from './entities/venta.repository.js';
import { Venta } from './entities/venta.entity.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { UpdateVentaDto } from './dto/update-venta.dto.js';

@Injectable()
export class VentaService {
  constructor(private readonly repositorio: VentaRepositorio) {}

  findAll(): Promise<Venta[]> {
    return this.repositorio.findAll();
  }

  async findById(idVenta: number): Promise<Venta> {
    const registro = await this.repositorio.findById(idVenta);
    if (!registro)
      throw new NotFoundException('Registro de venta no encontrado');
    return registro;
  }

  async create(dto: CreateVentaDto): Promise<Venta> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(idVenta: number, dto: UpdateVentaDto): Promise<Venta> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idVenta);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idVenta, data);
    if (!registro)
      throw new NotFoundException('Registro de venta no encontrado');
    return registro;
  }

  async delete(idVenta: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idVenta))) {
      throw new NotFoundException('Registro de venta no encontrado');
    }
    return { message: 'Registro de venta eliminado' };
  }

  private convertir(dto: CreateVentaDto | UpdateVentaDto): Partial<Venta> {
    const data: Partial<Venta> = {};
    if ('pacienteId' in dto && dto.pacienteId !== undefined)
      data.pacienteId = dto.pacienteId;
    if ('fechaVenta' in dto && dto.fechaVenta !== undefined)
      data.fechaVenta =
        dto.fechaVenta === null ? null : new Date(dto.fechaVenta);
    if ('estadoVenta' in dto && dto.estadoVenta !== undefined)
      data.estadoVenta = dto.estadoVenta;
    if ('tipoPagoId' in dto && dto.tipoPagoId !== undefined)
      data.tipoPagoId = dto.tipoPagoId;
    return data;
  }
}
