import { PartialType } from '@nestjs/mapped-types';
import { CreateConsultorioDto } from './create-consultorio.dto.js';

export class UpdateConsultorioDto extends PartialType(CreateConsultorioDto, {
  skipNullProperties: false,
}) {}
