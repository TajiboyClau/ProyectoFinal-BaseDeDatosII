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
import { Pagos } from './entities/pagos.entity.js';
import { PagosService } from './pagos.service.js';
import { CreatePagosDto } from './dto/create-pagos.dto.js';
import { UpdatePagosDto } from './dto/update-pagos.dto.js';

@Controller('pagos')
export class PagosController {
  constructor(private readonly service: PagosService) {}

  @Get()
  findAll(): Promise<Pagos[]> {
    return this.service.findAll();
  }

  @Get(':idPago')
  findById(@Param('idPago', IdPositivoPipe) idPago: number): Promise<Pagos> {
    return this.service.findById(idPago);
  }

  @Post()
  create(@Body() dto: CreatePagosDto): Promise<Pagos> {
    return this.service.create(dto);
  }

  @Patch(':idPago')
  update(
    @Param('idPago', IdPositivoPipe) idPago: number,
    @Body() dto: UpdatePagosDto,
  ): Promise<Pagos> {
    return this.service.update(idPago, dto);
  }

  @Delete(':idPago')
  delete(
    @Param('idPago', IdPositivoPipe) idPago: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idPago);
  }
}
