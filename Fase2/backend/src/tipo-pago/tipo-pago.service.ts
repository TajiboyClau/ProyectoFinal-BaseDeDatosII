import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TipoPagoRepositorio } from './entities/tipo-pago.repository.js';
import { TipoPago } from './entities/tipo-pago.entity.js';
import { CreateTipoPagoDto } from './dto/create-tipo-pago.dto.js';
import { UpdateTipoPagoDto } from './dto/update-tipo-pago.dto.js';

@Injectable()
export class TipoPagoService {
  constructor(private readonly repositorio: TipoPagoRepositorio) {}

  findAll(): Promise<TipoPago[]> {
    return this.repositorio.findAll();
  }

  async findById(idTipoPago: number): Promise<TipoPago> {
    const registro = await this.repositorio.findById(idTipoPago);
    if (!registro)
      throw new NotFoundException('Registro de tipo_pago no encontrado');
    return registro;
  }

  async create(dto: CreateTipoPagoDto): Promise<TipoPago> {
    const data = this.convertir(dto);
    return this.repositorio.create(data);
  }

  async update(idTipoPago: number, dto: UpdateTipoPagoDto): Promise<TipoPago> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idTipoPago);
    const registro = await this.repositorio.update(idTipoPago, data);
    if (!registro)
      throw new NotFoundException('Registro de tipo_pago no encontrado');
    return registro;
  }

  async delete(idTipoPago: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idTipoPago))) {
      throw new NotFoundException('Registro de tipo_pago no encontrado');
    }
    return { message: 'Registro de tipo_pago eliminado' };
  }

  private convertir(
    dto: CreateTipoPagoDto | UpdateTipoPagoDto,
  ): Partial<TipoPago> {
    const data: Partial<TipoPago> = {};
    if ('nombreTipoPago' in dto && dto.nombreTipoPago !== undefined)
      data.nombreTipoPago = dto.nombreTipoPago;
    return data;
  }
}
