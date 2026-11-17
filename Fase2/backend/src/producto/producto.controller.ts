import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto.js';
import { UpdateProductoDto } from './dto/update-producto.dto.js';
import { Producto } from './entities/producto.entity.js';
import { ProductoService } from './producto.service.js';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  create(@Body() createProductoDto: CreateProductoDto): Promise<Producto> {
    return this.productoService.create(createProductoDto);
  }

  @Get()
  findAll(): Promise<Producto[]> {
    return this.productoService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<Producto> {
    return this.productoService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ): Promise<Producto> {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    return this.productoService.delete(id);
  }
}
