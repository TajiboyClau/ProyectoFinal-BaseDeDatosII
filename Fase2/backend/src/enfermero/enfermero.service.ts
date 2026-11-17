import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EnfermeroRepositorio } from './entities/enfermero.repository.js';
import { Enfermero } from './entities/enfermero.entity.js';
import { CreateEnfermeroDto } from './dto/create-enfermero.dto.js';
import { UpdateEnfermeroDto } from './dto/update-enfermero.dto.js';

@Injectable()
export class EnfermeroService {
  constructor(private readonly repositorio: EnfermeroRepositorio) {}

  findAll(): Promise<Enfermero[]> {
    return this.repositorio.findAll();
  }

  async findById(enfermeroId: number): Promise<Enfermero> {
    const registro = await this.repositorio.findById(enfermeroId);
    if (!registro)
      throw new NotFoundException('Registro de enfermero no encontrado');
    return registro;
  }

  async create(dto: CreateEnfermeroDto): Promise<Enfermero> {
    const data = this.convertir(dto);
    return this.repositorio.create(data);
  }

  async update(
    enfermeroId: number,
    dto: UpdateEnfermeroDto,
  ): Promise<Enfermero> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(enfermeroId);
    const registro = await this.repositorio.update(enfermeroId, data);
    if (!registro)
      throw new NotFoundException('Registro de enfermero no encontrado');
    return registro;
  }

  async delete(enfermeroId: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(enfermeroId))) {
      throw new NotFoundException('Registro de enfermero no encontrado');
    }
    return { message: 'Registro de enfermero eliminado' };
  }

  private convertir(
    dto: CreateEnfermeroDto | UpdateEnfermeroDto,
  ): Partial<Enfermero> {
    const data: Partial<Enfermero> = {};
    if ('enfermeroNombre' in dto && dto.enfermeroNombre !== undefined)
      data.enfermeroNombre = dto.enfermeroNombre;
    if ('enfermeroApellido' in dto && dto.enfermeroApellido !== undefined)
      data.enfermeroApellido = dto.enfermeroApellido;
    return data;
  }
}
