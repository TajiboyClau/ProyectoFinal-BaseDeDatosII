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
import { DetalleVenta } from './entities/detalle-venta.entity.js';
import { DetalleVentaService } from './detalle-venta.service.js';
import { CreateDetalleVentaDto } from './dto/create-detalle-venta.dto.js';
import { UpdateDetalleVentaDto } from './dto/update-detalle-venta.dto.js';

@Controller('detalle-venta')
export class DetalleVentaController {
  constructor(private readonly service: DetalleVentaService) {}

  @Get()
  findAll(): Promise<DetalleVenta[]> {
    return this.service.findAll();
  }

  @Get(':idVenta/:idProducto')
  findById(
    @Param('idVenta', IdPositivoPipe) idVenta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
  ): Promise<DetalleVenta> {
    return this.service.findById(idVenta, idProducto);
  }

  @Post()
  create(@Body() dto: CreateDetalleVentaDto): Promise<DetalleVenta> {
    return this.service.create(dto);
  }

  @Patch(':idVenta/:idProducto')
  update(
    @Param('idVenta', IdPositivoPipe) idVenta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
    @Body() dto: UpdateDetalleVentaDto,
  ): Promise<DetalleVenta> {
    return this.service.update(idVenta, idProducto, dto);
  }

  @Delete(':idVenta/:idProducto')
  delete(
    @Param('idVenta', IdPositivoPipe) idVenta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idVenta, idProducto);
  }
}
