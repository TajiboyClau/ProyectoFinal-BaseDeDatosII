import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IdPositivoPipe } from '../common/id-positivo.pipe.js';
import { Diagnostico } from './entities/diagnostico.entity.js';
import { DiagnosticoService } from './diagnostico.service.js';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto.js';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto.js';

@Controller('diagnostico')
export class DiagnosticoController {
  constructor(private readonly service: DiagnosticoService) {}

  @Get()
  findAll(): Promise<Diagnostico[]> {
    return this.service.findAll();
  }

  @Get(':idDiagnostico')
  findById(
    @Param('idDiagnostico', IdPositivoPipe) idDiagnostico: number,
  ): Promise<Diagnostico> {
    return this.service.findById(idDiagnostico);
  }

  @Post()
  create(@Body() dto: CreateDiagnosticoDto): Promise<Diagnostico> {
    return this.service.create(dto);
  }

  @Patch(':idDiagnostico')
  update(
    @Param('idDiagnostico', IdPositivoPipe) idDiagnostico: number,
    @Body() dto: UpdateDiagnosticoDto,
  ): Promise<Diagnostico> {
    return this.service.update(idDiagnostico, dto);
  }

  @Delete(':idDiagnostico')
  delete(
    @Param('idDiagnostico', IdPositivoPipe) idDiagnostico: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idDiagnostico);
  }
}
