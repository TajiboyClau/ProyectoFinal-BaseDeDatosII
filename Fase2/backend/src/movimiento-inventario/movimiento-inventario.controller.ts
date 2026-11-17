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
import { MovimientoInventario } from './entities/movimiento-inventario.entity.js';
import { MovimientoInventarioService } from './movimiento-inventario.service.js';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto.js';
import { UpdateMovimientoInventarioDto } from './dto/update-movimiento-inventario.dto.js';

@Controller('movimiento-inventario')
export class MovimientoInventarioController {
  constructor(private readonly service: MovimientoInventarioService) {}

  @Get()
  findAll(): Promise<MovimientoInventario[]> {
    return this.service.findAll();
  }

  @Get(':idMovimiento')
  findById(
    @Param('idMovimiento', IdPositivoPipe) idMovimiento: number,
  ): Promise<MovimientoInventario> {
    return this.service.findById(idMovimiento);
  }

  @Post()
  create(
    @Body() dto: CreateMovimientoInventarioDto,
  ): Promise<MovimientoInventario> {
    return this.service.create(dto);
  }

  @Patch(':idMovimiento')
  update(
    @Param('idMovimiento', IdPositivoPipe) idMovimiento: number,
    @Body() dto: UpdateMovimientoInventarioDto,
  ): Promise<MovimientoInventario> {
    return this.service.update(idMovimiento, dto);
  }

  @Delete(':idMovimiento')
  delete(
    @Param('idMovimiento', IdPositivoPipe) idMovimiento: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idMovimiento);
  }
}
