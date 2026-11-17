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
import { HistorialClinico } from './entities/historial-clinico.entity.js';
import { HistorialClinicoService } from './historial-clinico.service.js';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto.js';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto.js';

@Controller('historial-clinico')
export class HistorialClinicoController {
  constructor(private readonly service: HistorialClinicoService) {}

  @Get()
  findAll(): Promise<HistorialClinico[]> {
    return this.service.findAll();
  }

  @Get(':idHistorial')
  findById(
    @Param('idHistorial', IdPositivoPipe) idHistorial: number,
  ): Promise<HistorialClinico> {
    return this.service.findById(idHistorial);
  }

  @Post()
  create(@Body() dto: CreateHistorialClinicoDto): Promise<HistorialClinico> {
    return this.service.create(dto);
  }

  @Patch(':idHistorial')
  update(
    @Param('idHistorial', IdPositivoPipe) idHistorial: number,
    @Body() dto: UpdateHistorialClinicoDto,
  ): Promise<HistorialClinico> {
    return this.service.update(idHistorial, dto);
  }

  @Delete(':idHistorial')
  delete(
    @Param('idHistorial', IdPositivoPipe) idHistorial: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idHistorial);
  }
}
