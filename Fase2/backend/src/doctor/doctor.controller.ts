import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { IdPositivoPipe } from '../common/id-positivo.pipe.js';
import { Doctor } from './entities/doctor.entity.js';
import { DoctorService } from './doctor.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly service: DoctorService) {}

  @Get()
  findAll(): Promise<Doctor[]> {
    return this.service.findAll();
  }

  @Get(':doctorId')
  findById(
    @Param('doctorId', IdPositivoPipe) doctorId: number,
  ): Promise<Doctor> {
    return this.service.findById(doctorId);
  }

  @Post()
  create(@Body() dto: CreateDoctorDto): Promise<Doctor> {
    return this.service.create(dto);
  }

  @Patch(':doctorId')
  update(
    @Param('doctorId', IdPositivoPipe) doctorId: number,
    @Body() dto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return this.service.update(doctorId, dto);
  }

  @Delete(':doctorId')
  delete(
    @Param('doctorId', IdPositivoPipe) doctorId: number,
  ): Promise<{ message: string }> {
    return this.service.delete(doctorId);
  }
}
