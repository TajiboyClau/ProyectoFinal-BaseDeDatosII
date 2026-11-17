import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from './entities/consulta.entity.js';
import { ConsultaRepositorio } from './entities/consulta.repository.js';
import { ConsultaService } from './consulta.service.js';
import { ConsultaController } from './consulta.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta])],
  controllers: [ConsultaController],
  providers: [ConsultaService, ConsultaRepositorio],
  exports: [ConsultaService],
})
export class ConsultaModule {}
