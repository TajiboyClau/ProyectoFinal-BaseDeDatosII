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
import { Consulta } from './entities/consulta.entity.js';
import { ConsultaService } from './consulta.service.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';

@Controller('consulta')
export class ConsultaController {
  constructor(private readonly service: ConsultaService) {}

  @Get()
  findAll(): Promise<Consulta[]> {
    return this.service.findAll();
  }

  @Get(':idConsulta')
  findById(
    @Param('idConsulta', IdPositivoPipe) idConsulta: number,
  ): Promise<Consulta> {
    return this.service.findById(idConsulta);
  }

  @Post()
  create(@Body() dto: CreateConsultaDto): Promise<Consulta> {
    return this.service.create(dto);
  }

  @Patch(':idConsulta')
  update(
    @Param('idConsulta', IdPositivoPipe) idConsulta: number,
    @Body() dto: UpdateConsultaDto,
  ): Promise<Consulta> {
    return this.service.update(idConsulta, dto);
  }

  @Delete(':idConsulta')
  delete(
    @Param('idConsulta', IdPositivoPipe) idConsulta: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idConsulta);
  }
}
