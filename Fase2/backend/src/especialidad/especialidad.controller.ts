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
import { Especialidad } from './entities/especialidad.entity.js';
import { EspecialidadService } from './especialidad.service.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';

@Controller('especialidad')
export class EspecialidadController {
  constructor(private readonly service: EspecialidadService) {}

  @Get()
  findAll(): Promise<Especialidad[]> {
    return this.service.findAll();
  }

  @Get(':idEspecialidad')
  findById(
    @Param('idEspecialidad', IdPositivoPipe) idEspecialidad: number,
  ): Promise<Especialidad> {
    return this.service.findById(idEspecialidad);
  }

  @Post()
  create(@Body() dto: CreateEspecialidadDto): Promise<Especialidad> {
    return this.service.create(dto);
  }

  @Patch(':idEspecialidad')
  update(
    @Param('idEspecialidad', IdPositivoPipe) idEspecialidad: number,
    @Body() dto: UpdateEspecialidadDto,
  ): Promise<Especialidad> {
    return this.service.update(idEspecialidad, dto);
  }

  @Delete(':idEspecialidad')
  delete(
    @Param('idEspecialidad', IdPositivoPipe) idEspecialidad: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idEspecialidad);
  }
}
