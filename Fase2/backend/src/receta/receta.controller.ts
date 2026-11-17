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
import { Receta } from './entities/receta.entity.js';
import { RecetaService } from './receta.service.js';
import { CreateRecetaDto } from './dto/create-receta.dto.js';
import { UpdateRecetaDto } from './dto/update-receta.dto.js';

@Controller('receta')
export class RecetaController {
  constructor(private readonly service: RecetaService) {}

  @Get()
  findAll(): Promise<Receta[]> {
    return this.service.findAll();
  }

  @Get(':idReceta')
  findById(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
  ): Promise<Receta> {
    return this.service.findById(idReceta);
  }

  @Post()
  create(@Body() dto: CreateRecetaDto): Promise<Receta> {
    return this.service.create(dto);
  }

  @Patch(':idReceta')
  update(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
    @Body() dto: UpdateRecetaDto,
  ): Promise<Receta> {
    return this.service.update(idReceta, dto);
  }

  @Delete(':idReceta')
  delete(
    @Param('idReceta', IdPositivoPipe) idReceta: number,
  ): Promise<{ message: string }> {
    return this.service.delete(idReceta);
  }
}
