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
import { Enfermero } from './entities/enfermero.entity.js';
import { EnfermeroService } from './enfermero.service.js';
import { CreateEnfermeroDto } from './dto/create-enfermero.dto.js';
import { UpdateEnfermeroDto } from './dto/update-enfermero.dto.js';

@Controller('enfermero')
export class EnfermeroController {
  constructor(private readonly service: EnfermeroService) {}

  @Get()
  findAll(): Promise<Enfermero[]> {
    return this.service.findAll();
  }

  @Get(':enfermeroId')
  findById(
    @Param('enfermeroId', IdPositivoPipe) enfermeroId: number,
  ): Promise<Enfermero> {
    return this.service.findById(enfermeroId);
  }

  @Post()
  create(@Body() dto: CreateEnfermeroDto): Promise<Enfermero> {
    return this.service.create(dto);
  }

  @Patch(':enfermeroId')
  update(
    @Param('enfermeroId', IdPositivoPipe) enfermeroId: number,
    @Body() dto: UpdateEnfermeroDto,
  ): Promise<Enfermero> {
    return this.service.update(enfermeroId, dto);
  }

  @Delete(':enfermeroId')
  delete(
    @Param('enfermeroId', IdPositivoPipe) enfermeroId: number,
  ): Promise<{ message: string }> {
    return this.service.delete(enfermeroId);
  }
}
