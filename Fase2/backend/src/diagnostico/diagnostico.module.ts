import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './entities/diagnostico.entity.js';
import { DiagnosticoRepositorio } from './entities/diagnostico.repository.js';
import { DiagnosticoService } from './diagnostico.service.js';
import { DiagnosticoController } from './diagnostico.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnostico])],
  controllers: [DiagnosticoController],
  providers: [DiagnosticoService, DiagnosticoRepositorio],
  exports: [DiagnosticoService],
})
export class DiagnosticoModule {}
