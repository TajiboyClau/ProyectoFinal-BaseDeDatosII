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
import { Cita } from './entities/cita.entity.js';
import { CitaService } from './cita.service.js';
import { CreateCitaDto } from './dto/create-cita.dto.js';
import { UpdateCitaDto } from './dto/update-cita.dto.js';
import { SolicitudCitaPublicaDto } from './dto/solicitud-cita-publica.dto.js';

@Controller('cita')
export class CitaController {
  constructor(private readonly service: CitaService) {}

  @Post('publica')
  solicitarPublica(@Body() dto: SolicitudCitaPublicaDto): Promise<Cita> {
    return this.service.solicitarPublica(dto);
  }

  @Get()
  findAll(): Promise<Cita[]> {
    return this.service.findAll();
  }

  @Get(':idCita')
  findById(@Param('idCita', IdPositivoPipe) idCita: number): Promise<Cita> {
    return this.service.findById(idCita);
  }

  @Post()
  create(@Body() dto: CreateCitaDto): Promise<Cita> {
    return this.service.create(dto);
  }

  @Patch(':idCita')
  update(
    @Param('idCita', IdPositivoPipe) idCita: number,
    @Body() dto: UpdateCitaDto,
  ): Promise<Cita> {
    return this.service.update(idCita, dto);
  }

  @Delete(':idCita')
  delete(
    @Param('idCita', IdPositivoPipe) idCita: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idCita);
  }
}
