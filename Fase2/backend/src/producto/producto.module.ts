import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoController } from './producto.controller.js';
import { ProductoService } from './producto.service.js';
import { Producto } from './entities/producto.entity.js';
import { ProductoRepositorio } from './entities/producto.repository.js';

@Module({
  imports: [TypeOrmModule.forFeature([Producto])],
  controllers: [ProductoController],
  providers: [ProductoService, ProductoRepositorio],
})
export class ProductoModule {}
