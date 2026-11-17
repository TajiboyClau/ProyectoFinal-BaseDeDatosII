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
import { Paciente } from './entities/paciente.entity.js';
import { PacienteService } from './paciente.service.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';

@Controller('paciente')
export class PacienteController {
  constructor(private readonly service: PacienteService) {}

  @Get()
  findAll(): Promise<Paciente[]> {
    return this.service.findAll();
  }

  @Get(':idPaciente')
  findById(
    @Param('idPaciente', IdPositivoPipe) idPaciente: number,
  ): Promise<Paciente> {
    return this.service.findById(idPaciente);
  }

  @Post()
  create(@Body() dto: CreatePacienteDto): Promise<Paciente> {
    return this.service.create(dto);
  }

  @Patch(':idPaciente')
  update(
    @Param('idPaciente', IdPositivoPipe) idPaciente: number,
    @Body() dto: UpdatePacienteDto,
  ): Promise<Paciente> {
    return this.service.update(idPaciente, dto);
  }

  @Delete(':idPaciente')
  delete(
    @Param('idPaciente', IdPositivoPipe) idPaciente: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idPaciente);
  }
}
