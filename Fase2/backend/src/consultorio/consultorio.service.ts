import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConsultorioRepositorio } from './entities/consultorio.repository.js';
import { Consultorio } from './entities/consultorio.entity.js';
import { CreateConsultorioDto } from './dto/create-consultorio.dto.js';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto.js';

@Injectable()
export class ConsultorioService {
  constructor(private readonly repositorio: ConsultorioRepositorio) {}

  findAll(): Promise<Consultorio[]> {
    return this.repositorio.findAll();
  }

  async findById(idConsultorio: number): Promise<Consultorio> {
    const registro = await this.repositorio.findById(idConsultorio);
    if (!registro)
      throw new NotFoundException('Registro de consultorio no encontrado');
    return registro;
  }

  async create(dto: CreateConsultorioDto): Promise<Consultorio> {
    const data = this.convertir(dto);
    return this.repositorio.create(data);
  }

  async update(
    idConsultorio: number,
    dto: UpdateConsultorioDto,
  ): Promise<Consultorio> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idConsultorio);
    const registro = await this.repositorio.update(idConsultorio, data);
    if (!registro)
      throw new NotFoundException('Registro de consultorio no encontrado');
    return registro;
  }

  async delete(idConsultorio: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idConsultorio))) {
      throw new NotFoundException('Registro de consultorio no encontrado');
    }
    return { message: 'Registro de consultorio eliminado' };
  }

  private convertir(
    dto: CreateConsultorioDto | UpdateConsultorioDto,
  ): Partial<Consultorio> {
    const data: Partial<Consultorio> = {};
    if ('nombreConsultorio' in dto && dto.nombreConsultorio !== undefined)
      data.nombreConsultorio = dto.nombreConsultorio;
    return data;
  }
}
