import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateDetalleRecetaDto } from './create-detalle-receta.dto.js';

export class UpdateDetalleRecetaDto extends PartialType(
  OmitType(CreateDetalleRecetaDto, ['idReceta', 'idProducto'] as const),
  { skipNullProperties: false },
) {}
