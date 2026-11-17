import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enfermero } from './entities/enfermero.entity.js';
import { EnfermeroRepositorio } from './entities/enfermero.repository.js';
import { EnfermeroService } from './enfermero.service.js';
import { EnfermeroController } from './enfermero.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Enfermero])],
  controllers: [EnfermeroController],
  providers: [EnfermeroService, EnfermeroRepositorio],
  exports: [EnfermeroService],
})
export class EnfermeroModule {}
