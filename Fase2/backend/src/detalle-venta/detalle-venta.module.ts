import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVenta } from './entities/detalle-venta.entity.js';
import { DetalleVentaRepositorio } from './entities/detalle-venta.repository.js';
import { DetalleVentaService } from './detalle-venta.service.js';
import { DetalleVentaController } from './detalle-venta.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [DetalleVentaController],
  providers: [DetalleVentaService, DetalleVentaRepositorio],
  exports: [DetalleVentaService],
})
export class DetalleVentaModule {}
