import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pagos } from './entities/pagos.entity.js';
import { PagosRepositorio } from './entities/pagos.repository.js';
import { PagosService } from './pagos.service.js';
import { PagosController } from './pagos.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pagos])],
  controllers: [PagosController],
  providers: [PagosService, PagosRepositorio],
  exports: [PagosService],
})
export class PagosModule {}
