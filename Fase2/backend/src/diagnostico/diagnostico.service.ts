import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DiagnosticoRepositorio } from './entities/diagnostico.repository.js';
import { Diagnostico } from './entities/diagnostico.entity.js';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto.js';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto.js';

@Injectable()
export class DiagnosticoService {
  constructor(private readonly repositorio: DiagnosticoRepositorio) {}

  findAll(): Promise<Diagnostico[]> {
    return this.repositorio.findAll();
  }

  async findById(idDiagnostico: number): Promise<Diagnostico> {
    const registro = await this.repositorio.findById(idDiagnostico);
    if (!registro)
      throw new NotFoundException('Registro de diagnostico no encontrado');
    return registro;
  }

  async create(dto: CreateDiagnosticoDto): Promise<Diagnostico> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(
    idDiagnostico: number,
    dto: UpdateDiagnosticoDto,
  ): Promise<Diagnostico> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idDiagnostico);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idDiagnostico, data);
    if (!registro)
      throw new NotFoundException('Registro de diagnostico no encontrado');
    return registro;
  }

  async delete(idDiagnostico: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idDiagnostico))) {
      throw new NotFoundException('Registro de diagnostico no encontrado');
    }
    return { message: 'Registro de diagnostico eliminado' };
  }

  private convertir(
    dto: CreateDiagnosticoDto | UpdateDiagnosticoDto,
  ): Partial<Diagnostico> {
    const data: Partial<Diagnostico> = {};
    if ('consultaId' in dto && dto.consultaId !== undefined)
      data.consultaId = dto.consultaId;
    if ('diagnostico' in dto && dto.diagnostico !== undefined)
      data.diagnostico = dto.diagnostico;
    return data;
  }
}
