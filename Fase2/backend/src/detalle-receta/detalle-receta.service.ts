import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DetalleRecetaRepositorio } from './entities/detalle-receta.repository.js';
import { DetalleReceta } from './entities/detalle-receta.entity.js';
import { CreateDetalleRecetaDto } from './dto/create-detalle-receta.dto.js';
import { UpdateDetalleRecetaDto } from './dto/update-detalle-receta.dto.js';

@Injectable()
export class DetalleRecetaService {
  constructor(private readonly repositorio: DetalleRecetaRepositorio) {}

  findAll(): Promise<DetalleReceta[]> {
    return this.repositorio.findAll();
  }

  async findById(idReceta: number, idProducto: number): Promise<DetalleReceta> {
    const registro = await this.repositorio.findById(idReceta, idProducto);
    if (!registro)
      throw new NotFoundException('Registro de detalle_receta no encontrado');
    return registro;
  }

  async create(dto: CreateDetalleRecetaDto): Promise<DetalleReceta> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(
    idReceta: number,
    idProducto: number,
    dto: UpdateDetalleRecetaDto,
  ): Promise<DetalleReceta> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idReceta, idProducto);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idReceta, idProducto, data);
    if (!registro)
      throw new NotFoundException('Registro de detalle_receta no encontrado');
    return registro;
  }

  async delete(
    idReceta: number,
    idProducto: number,
  ): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idReceta, idProducto))) {
      throw new NotFoundException('Registro de detalle_receta no encontrado');
    }
    return { message: 'Registro de detalle_receta eliminado' };
  }

  private convertir(
    dto: CreateDetalleRecetaDto | UpdateDetalleRecetaDto,
  ): Partial<DetalleReceta> {
    const data: Partial<DetalleReceta> = {};
    if ('idReceta' in dto && dto.idReceta !== undefined)
      data.idReceta = dto.idReceta;
    if ('idProducto' in dto && dto.idProducto !== undefined)
      data.idProducto = dto.idProducto;
    if (
      'detalleRecetaFrecuencia' in dto &&
      dto.detalleRecetaFrecuencia !== undefined
    )
      data.detalleRecetaFrecuencia = dto.detalleRecetaFrecuencia;
    if (
      'detalleRecetaCantidad' in dto &&
      dto.detalleRecetaCantidad !== undefined
    )
      data.detalleRecetaCantidad =
        dto.detalleRecetaCantidad === null
          ? null
          : dto.detalleRecetaCantidad.toFixed(2);
    if ('viaAdministracion' in dto && dto.viaAdministracion !== undefined)
      data.viaAdministracion = dto.viaAdministracion;
    if ('observaciones' in dto && dto.observaciones !== undefined)
      data.observaciones = dto.observaciones;
    return data;
  }
}
