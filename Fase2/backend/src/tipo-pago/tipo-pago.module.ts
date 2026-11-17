import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoPago } from './entities/tipo-pago.entity.js';
import { TipoPagoRepositorio } from './entities/tipo-pago.repository.js';
import { TipoPagoService } from './tipo-pago.service.js';
import { TipoPagoController } from './tipo-pago.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([TipoPago])],
  controllers: [TipoPagoController],
  providers: [TipoPagoService, TipoPagoRepositorio],
  exports: [TipoPagoService],
})
export class TipoPagoModule {}
