import { PartialType } from '@nestjs/mapped-types';
import { CreatePagosDto } from './create-pagos.dto.js';

export class UpdatePagosDto extends PartialType(CreatePagosDto, {
  skipNullProperties: false,
}) {}
