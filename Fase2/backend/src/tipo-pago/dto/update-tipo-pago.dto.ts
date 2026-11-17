import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoPagoDto } from './create-tipo-pago.dto.js';

export class UpdateTipoPagoDto extends PartialType(CreateTipoPagoDto, {
  skipNullProperties: false,
}) {}
