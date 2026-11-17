import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Receta } from './entities/receta.entity.js';
import { RecetaRepositorio } from './entities/receta.repository.js';
import { RecetaService } from './receta.service.js';
import { RecetaController } from './receta.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Receta])],
  controllers: [RecetaController],
  providers: [RecetaService, RecetaRepositorio],
  exports: [RecetaService],
})
export class RecetaModule {}
