import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity.js';
import { MovimientoInventarioRepositorio } from './entities/movimiento-inventario.repository.js';
import { MovimientoInventarioService } from './movimiento-inventario.service.js';
import { MovimientoInventarioController } from './movimiento-inventario.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([MovimientoInventario])],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService, MovimientoInventarioRepositorio],
  exports: [MovimientoInventarioService],
})
export class MovimientoInventarioModule {}
