import { PartialType } from '@nestjs/mapped-types';
import { CreateEnfermeroDto } from './create-enfermero.dto.js';

export class UpdateEnfermeroDto extends PartialType(CreateEnfermeroDto, {
  skipNullProperties: false,
}) {}
