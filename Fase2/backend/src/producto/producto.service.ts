import { BadRequestException, Injectable } from '@nestjs/common';
import { Producto } from './entities/producto.entity.js';
import { ProductoRepositorio } from './entities/producto.repository.js';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class ProductoService {
  //Esta es la capa de la logica de negocio
  constructor(private readonly productoRepository: ProductoRepositorio) {}

  async findAll() {
    return this.productoRepository.findAll();
  }

  async findById(id: number) {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  create(dto: CreateProductoDto) {
    return this.productoRepository.create({
      nombreProducto: dto.nombreProducto,
      precioProducto: dto.precioProducto.toFixed(2),
      estadoProducto: dto.estadoProducto ?? true,
    });
  }
  async update(id: number, dto: UpdateProductoDto) {
    const cambios: Partial<Producto> = {};
    if (dto.nombreProducto !== undefined)
      cambios.nombreProducto = dto.nombreProducto;
    if (dto.precioProducto !== undefined)
      cambios.precioProducto = dto.precioProducto.toFixed(2);
    if (dto.estadoProducto !== undefined)
      cambios.estadoProducto = dto.estadoProducto;
    if (Object.keys(cambios).length === 0)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    const producto = await this.productoRepository.update(id, cambios);
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }
  async delete(id: number) {
    const eliminado = await this.productoRepository.delete(id);
    if (!eliminado) throw new NotFoundException('Producto no encontrado');
    return { message: 'Producto eliminado' };
  }
}
