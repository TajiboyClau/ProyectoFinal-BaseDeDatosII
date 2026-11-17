import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EspecialidadRepositorio } from './entities/especialidad.repository.js';
import { Especialidad } from './entities/especialidad.entity.js';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto.js';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto.js';

@Injectable()
export class EspecialidadService {
  constructor(private readonly repositorio: EspecialidadRepositorio) {}

  findAll(): Promise<Especialidad[]> {
    return this.repositorio.findAll();
  }

  async findById(idEspecialidad: number): Promise<Especialidad> {
    const registro = await this.repositorio.findById(idEspecialidad);
    if (!registro)
      throw new NotFoundException('Registro de especialidad no encontrado');
    return registro;
  }

  async create(dto: CreateEspecialidadDto): Promise<Especialidad> {
    const data = this.convertir(dto);
    return this.repositorio.create(data);
  }

  async update(
    idEspecialidad: number,
    dto: UpdateEspecialidadDto,
  ): Promise<Especialidad> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idEspecialidad);
    const registro = await this.repositorio.update(idEspecialidad, data);
    if (!registro)
      throw new NotFoundException('Registro de especialidad no encontrado');
    return registro;
  }

  async delete(idEspecialidad: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idEspecialidad))) {
      throw new NotFoundException('Registro de especialidad no encontrado');
    }
    return { message: 'Registro de especialidad eliminado' };
  }

  private convertir(
    dto: CreateEspecialidadDto | UpdateEspecialidadDto,
  ): Partial<Especialidad> {
    const data: Partial<Especialidad> = {};
    if ('nombreEspecialidad' in dto && dto.nombreEspecialidad !== undefined)
      data.nombreEspecialidad = dto.nombreEspecialidad;
    return data;
  }
}
