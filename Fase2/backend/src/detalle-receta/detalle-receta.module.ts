import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleReceta } from './entities/detalle-receta.entity.js';
import { DetalleRecetaRepositorio } from './entities/detalle-receta.repository.js';
import { DetalleRecetaService } from './detalle-receta.service.js';
import { DetalleRecetaController } from './detalle-receta.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleReceta])],
  controllers: [DetalleRecetaController],
  providers: [DetalleRecetaService, DetalleRecetaRepositorio],
  exports: [DetalleRecetaService],
})
export class DetalleRecetaModule {}
