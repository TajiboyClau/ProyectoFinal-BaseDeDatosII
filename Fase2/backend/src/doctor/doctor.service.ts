import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorRepositorio } from './entities/doctor.repository.js';
import { Doctor } from './entities/doctor.entity.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Injectable()
export class DoctorService {
  constructor(private readonly repositorio: DoctorRepositorio) {}

  findAll(): Promise<Doctor[]> {
    return this.repositorio.findAll();
  }

  async findById(doctorId: number): Promise<Doctor> {
    const registro = await this.repositorio.findById(doctorId);
    if (!registro)
      throw new NotFoundException('Registro de doctor no encontrado');
    return registro;
  }

  async create(dto: CreateDoctorDto): Promise<Doctor> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(doctorId: number, dto: UpdateDoctorDto): Promise<Doctor> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(doctorId);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(doctorId, data);
    if (!registro)
      throw new NotFoundException('Registro de doctor no encontrado');
    return registro;
  }

  async delete(doctorId: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(doctorId))) {
      throw new NotFoundException('Registro de doctor no encontrado');
    }
    return { message: 'Registro de doctor eliminado' };
  }

  private convertir(dto: CreateDoctorDto | UpdateDoctorDto): Partial<Doctor> {
    const data: Partial<Doctor> = {};
    if ('doctorNombre' in dto && dto.doctorNombre !== undefined)
      data.doctorNombre = dto.doctorNombre;
    if ('doctorApellido' in dto && dto.doctorApellido !== undefined)
      data.doctorApellido = dto.doctorApellido;
    if ('doctorEspecialidad' in dto && dto.doctorEspecialidad !== undefined)
      data.doctorEspecialidad = dto.doctorEspecialidad;
    if ('telefono' in dto && dto.telefono !== undefined)
      data.telefono = dto.telefono;
    if ('correo' in dto && dto.correo !== undefined) data.correo = dto.correo;
    return data;
  }
}
