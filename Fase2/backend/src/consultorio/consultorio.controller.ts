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
import { Consultorio } from './entities/consultorio.entity.js';
import { ConsultorioService } from './consultorio.service.js';
import { CreateConsultorioDto } from './dto/create-consultorio.dto.js';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto.js';

@Controller('consultorio')
export class ConsultorioController {
  constructor(private readonly service: ConsultorioService) {}

  @Get()
  findAll(): Promise<Consultorio[]> {
    return this.service.findAll();
  }

  @Get(':idConsultorio')
  findById(
    @Param('idConsultorio', IdPositivoPipe) idConsultorio: number,
  ): Promise<Consultorio> {
    return this.service.findById(idConsultorio);
  }

  @Post()
  create(@Body() dto: CreateConsultorioDto): Promise<Consultorio> {
    return this.service.create(dto);
  }

  @Patch(':idConsultorio')
  update(
    @Param('idConsultorio', IdPositivoPipe) idConsultorio: number,
    @Body() dto: UpdateConsultorioDto,
  ): Promise<Consultorio> {
    return this.service.update(idConsultorio, dto);
  }

  @Delete(':idConsultorio')
  delete(
    @Param('idConsultorio', IdPositivoPipe) idConsultorio: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idConsultorio);
  }
}
