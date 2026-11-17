import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDetalleVentaDto } from './create-detalle-venta.dto.js';

export class UpdateDetalleVentaDto extends PartialType(
  OmitType(CreateDetalleVentaDto, ['idVenta', 'idProducto'] as const),
  { skipNullProperties: false },
) {}
