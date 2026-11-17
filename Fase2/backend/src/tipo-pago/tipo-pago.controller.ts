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
import { TipoPago } from './entities/tipo-pago.entity.js';
import { TipoPagoService } from './tipo-pago.service.js';
import { CreateTipoPagoDto } from './dto/create-tipo-pago.dto.js';
import { UpdateTipoPagoDto } from './dto/update-tipo-pago.dto.js';

@Controller('tipo-pago')
export class TipoPagoController {
  constructor(private readonly service: TipoPagoService) {}

  @Get()
  findAll(): Promise<TipoPago[]> {
    return this.service.findAll();
  }

  @Get(':idTipoPago')
  findById(
    @Param('idTipoPago', IdPositivoPipe) idTipoPago: number,
  ): Promise<TipoPago> {
    return this.service.findById(idTipoPago);
  }

  @Post()
  create(@Body() dto: CreateTipoPagoDto): Promise<TipoPago> {
    return this.service.create(dto);
  }

  @Patch(':idTipoPago')
  update(
    @Param('idTipoPago', IdPositivoPipe) idTipoPago: number,
    @Body() dto: UpdateTipoPagoDto,
  ): Promise<TipoPago> {
    return this.service.update(idTipoPago, dto);
  }

  @Delete(':idTipoPago')
  delete(
    @Param('idTipoPago', IdPositivoPipe) idTipoPago: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idTipoPago);
  }
}
