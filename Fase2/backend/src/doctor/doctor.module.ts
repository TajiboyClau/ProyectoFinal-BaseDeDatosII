import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity.js';
import { DoctorRepositorio } from './entities/doctor.repository.js';
import { DoctorService } from './doctor.service.js';
import { DoctorController } from './doctor.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepositorio],
  exports: [DoctorService],
})
export class DoctorModule {}
