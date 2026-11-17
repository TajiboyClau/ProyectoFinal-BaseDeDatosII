import { PartialType } from '@nestjs/mapped-types';
import { CreateMovimientoInventarioDto } from './create-movimiento-inventario.dto.js';

export class UpdateMovimientoInventarioDto extends PartialType(
  CreateMovimientoInventarioDto,
  { skipNullProperties: false },
) {}
