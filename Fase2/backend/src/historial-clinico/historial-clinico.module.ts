import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistorialClinico } from './entities/historial-clinico.entity.js';
import { HistorialClinicoRepositorio } from './entities/historial-clinico.repository.js';
import { HistorialClinicoService } from './historial-clinico.service.js';
import { HistorialClinicoController } from './historial-clinico.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([HistorialClinico])],
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService, HistorialClinicoRepositorio],
  exports: [HistorialClinicoService],
})
export class HistorialClinicoModule {}
