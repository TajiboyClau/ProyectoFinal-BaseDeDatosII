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
import { DetalleReceta } from './entities/detalle-receta.entity.js';
import { DetalleRecetaService } from './detalle-receta.service.js';
import { CreateDetalleRecetaDto } from './dto/create-detalle-receta.dto.js';
import { UpdateDetalleRecetaDto } from './dto/update-detalle-receta.dto.js';

@Controller('detalle-receta')
export class DetalleRecetaController {
  constructor(private readonly service: DetalleRecetaService) {}

  @Get()
  findAll(): Promise<DetalleReceta[]> {
    return this.service.findAll();
  }

  @Get(':idReceta/:idProducto')
  findById(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
  ): Promise<DetalleReceta> {
    return this.service.findById(idReceta, idProducto);
  }

  @Post()
  create(@Body() dto: CreateDetalleRecetaDto): Promise<DetalleReceta> {
    return this.service.create(dto);
  }

  @Patch(':idReceta/:idProducto')
  update(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
    @Body() dto: UpdateDetalleRecetaDto,
  ): Promise<DetalleReceta> {
    return this.service.update(idReceta, idProducto, dto);
  }

  @Delete(':idReceta/:idProducto')
  delete(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
    @Param('idProducto', IdPositivoPipe) idProducto: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idReceta, idProducto);
  }
}
