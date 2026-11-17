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
import { Venta } from './entities/venta.entity.js';
import { VentaService } from './venta.service.js';
import { CreateVentaDto } from './dto/create-venta.dto.js';
import { UpdateVentaDto } from './dto/update-venta.dto.js';

@Controller('venta')
export class VentaController {
  constructor(private readonly service: VentaService) {}

  @Get()
  findAll(): Promise<Venta[]> {
    return this.service.findAll();
  }

  @Get(':idVenta')
  findById(@Param('idVenta', IdPositivoPipe) idVenta: number): Promise<Venta> {
    return this.service.findById(idVenta);
  }

  @Post()
  create(@Body() dto: CreateVentaDto): Promise<Venta> {
    return this.service.create(dto);
  }

  @Patch(':idVenta')
  update(
    @Param('idVenta', IdPositivoPipe) idVenta: number,
    @Body() dto: UpdateVentaDto,
  ): Promise<Venta> {
    return this.service.update(idVenta, dto);
  }

  @Delete(':idVenta')
  delete(
    @Param('idVenta', IdPositivoPipe) idVenta: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idVenta);
  }
}
