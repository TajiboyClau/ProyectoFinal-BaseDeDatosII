import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HistorialClinicoRepositorio } from './entities/historial-clinico.repository.js';
import { HistorialClinico } from './entities/historial-clinico.entity.js';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto.js';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto.js';

@Injectable()
export class HistorialClinicoService {
  constructor(private readonly repositorio: HistorialClinicoRepositorio) {}

  findAll(): Promise<HistorialClinico[]> {
    return this.repositorio.findAll();
  }

  async findById(idHistorial: number): Promise<HistorialClinico> {
    const registro = await this.repositorio.findById(idHistorial);
    if (!registro)
      throw new NotFoundException(
        'Registro de historial_clinico no encontrado',
      );
    return registro;
  }

  async create(dto: CreateHistorialClinicoDto): Promise<HistorialClinico> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(
    idHistorial: number,
    dto: UpdateHistorialClinicoDto,
  ): Promise<HistorialClinico> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idHistorial);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idHistorial, data);
    if (!registro)
      throw new NotFoundException(
        'Registro de historial_clinico no encontrado',
      );
    return registro;
  }

  async delete(idHistorial: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idHistorial))) {
      throw new NotFoundException(
        'Registro de historial_clinico no encontrado',
      );
    }
    return { message: 'Registro de historial_clinico eliminado' };
  }

  private convertir(
    dto: CreateHistorialClinicoDto | UpdateHistorialClinicoDto,
  ): Partial<HistorialClinico> {
    const data: Partial<HistorialClinico> = {};
    if ('pacienteId' in dto && dto.pacienteId !== undefined)
      data.pacienteId = dto.pacienteId;
    if ('fechaApertura' in dto && dto.fechaApertura !== undefined)
      data.fechaApertura = dto.fechaApertura;
    if ('grupoSanguineo' in dto && dto.grupoSanguineo !== undefined)
      data.grupoSanguineo = dto.grupoSanguineo;
    if ('alergias' in dto && dto.alergias !== undefined)
      data.alergias = dto.alergias;
    if ('antecedentes' in dto && dto.antecedentes !== undefined)
      data.antecedentes = dto.antecedentes;
    if ('estadoHistorial' in dto && dto.estadoHistorial !== undefined)
      data.estadoHistorial = dto.estadoHistorial;
    return data;
  }
}
