import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosticoDto } from './create-diagnostico.dto.js';

export class UpdateDiagnosticoDto extends PartialType(CreateDiagnosticoDto, {
  skipNullProperties: false,
}) {}
