import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Especialidad } from './entities/especialidad.entity.js';
import { EspecialidadRepositorio } from './entities/especialidad.repository.js';
import { EspecialidadService } from './especialidad.service.js';
import { EspecialidadController } from './especialidad.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  controllers: [EspecialidadController],
  providers: [EspecialidadService, EspecialidadRepositorio],
  exports: [EspecialidadService],
})
export class EspecialidadModule {}
