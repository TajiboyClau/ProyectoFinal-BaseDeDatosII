import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './entities/paciente.entity.js';
import { PacienteRepositorio } from './entities/paciente.repository.js';
import { PacienteService } from './paciente.service.js';
import { PacienteController } from './paciente.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente])],
  controllers: [PacienteController],
  providers: [PacienteService, PacienteRepositorio],
  exports: [PacienteService],
})
export class PacienteModule {}
