import { PartialType } from '@nestjs/mapped-types';
import { CreateHistorialClinicoDto } from './create-historial-clinico.dto.js';

export class UpdateHistorialClinicoDto extends PartialType(
  CreateHistorialClinicoDto,
  { skipNullProperties: false },
) {}
