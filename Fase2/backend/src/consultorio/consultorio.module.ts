import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consultorio } from './entities/consultorio.entity.js';
import { ConsultorioRepositorio } from './entities/consultorio.repository.js';
import { ConsultorioService } from './consultorio.service.js';
import { ConsultorioController } from './consultorio.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Consultorio])],
  controllers: [ConsultorioController],
  providers: [ConsultorioService, ConsultorioRepositorio],
  exports: [ConsultorioService],
})
export class ConsultorioModule {}
