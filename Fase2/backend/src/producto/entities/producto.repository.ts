import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './producto.entity.js';

@Injectable()
export class ProductoRepositorio {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  findAll(): Promise<Producto[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<Producto | null> {
    return this.repo.findOneBy({ idProducto: id });
  }

  create(data: Partial<Producto>): Promise<Producto> {
    const nuevoProducto = this.repo.create(data);
    return this.repo.save(nuevoProducto);
  }

  async update(id: number, data: Partial<Producto>): Promise<Producto | null> {
    const producto = await this.findById(id);
    if (!producto) {
      return null;
    }

    await this.repo.update({ idProducto: id }, data);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idProducto: id });
    return (resultado.affected ?? 0) > 0;
  }
}
