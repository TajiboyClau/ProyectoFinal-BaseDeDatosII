import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PagosRepositorio } from './entities/pagos.repository.js';
import { Pagos } from './entities/pagos.entity.js';
import { CreatePagosDto } from './dto/create-pagos.dto.js';
import { UpdatePagosDto } from './dto/update-pagos.dto.js';

@Injectable()
export class PagosService {
  constructor(private readonly repositorio: PagosRepositorio) {}

  findAll(): Promise<Pagos[]> {
    return this.repositorio.findAll();
  }

  async findById(idPago: number): Promise<Pagos> {
    const registro = await this.repositorio.findById(idPago);
    if (!registro)
      throw new NotFoundException('Registro de pagos no encontrado');
    return registro;
  }

  async create(dto: CreatePagosDto): Promise<Pagos> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(idPago: number, dto: UpdatePagosDto): Promise<Pagos> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idPago);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idPago, data);
    if (!registro)
      throw new NotFoundException('Registro de pagos no encontrado');
    return registro;
  }

  async delete(idPago: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idPago))) {
      throw new NotFoundException('Registro de pagos no encontrado');
    }
    return { message: 'Registro de pagos eliminado' };
  }

  private convertir(dto: CreatePagosDto | UpdatePagosDto): Partial<Pagos> {
    const data: Partial<Pagos> = {};
    if ('citaId' in dto && dto.citaId !== undefined) data.citaId = dto.citaId;
    if ('tipoPagoId' in dto && dto.tipoPagoId !== undefined)
      data.tipoPagoId = dto.tipoPagoId;
    if ('montoPago' in dto && dto.montoPago !== undefined)
      data.montoPago = dto.montoPago === null ? null : dto.montoPago.toFixed(2);
    if ('fechaPago' in dto && dto.fechaPago !== undefined)
      data.fechaPago = dto.fechaPago === null ? null : new Date(dto.fechaPago);
    if ('estadoPago' in dto && dto.estadoPago !== undefined)
      data.estadoPago = dto.estadoPago;
    return data;
  }
}
