import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConsultaRepositorio } from './entities/consulta.repository.js';
import { Consulta } from './entities/consulta.entity.js';
import { CreateConsultaDto } from './dto/create-consulta.dto.js';
import { UpdateConsultaDto } from './dto/update-consulta.dto.js';

@Injectable()
export class ConsultaService {
  constructor(private readonly repositorio: ConsultaRepositorio) {}

  findAll(): Promise<Consulta[]> {
    return this.repositorio.findAll();
  }

  async findById(idConsulta: number): Promise<Consulta> {
    const registro = await this.repositorio.findById(idConsulta);
    if (!registro)
      throw new NotFoundException('Registro de consulta no encontrado');
    return registro;
  }

  async create(dto: CreateConsultaDto): Promise<Consulta> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async update(idConsulta: number, dto: UpdateConsultaDto): Promise<Consulta> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idConsulta);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idConsulta, data);
    if (!registro)
      throw new NotFoundException('Registro de consulta no encontrado');
    return registro;
  }

  async delete(idConsulta: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idConsulta))) {
      throw new NotFoundException('Registro de consulta no encontrado');
    }
    return { message: 'Registro de consulta eliminado' };
  }

  private convertir(
    dto: CreateConsultaDto | UpdateConsultaDto,
  ): Partial<Consulta> {
    const data: Partial<Consulta> = {};
    if ('citaId' in dto && dto.citaId !== undefined) data.citaId = dto.citaId;
    if ('fechaHoraInicio' in dto && dto.fechaHoraInicio !== undefined)
      data.fechaHoraInicio =
        dto.fechaHoraInicio === null ? null : new Date(dto.fechaHoraInicio);
    if ('motivoConsulta' in dto && dto.motivoConsulta !== undefined)
      data.motivoConsulta = dto.motivoConsulta;
    if ('sintomas' in dto && dto.sintomas !== undefined)
      data.sintomas = dto.sintomas;
    if ('observaciones' in dto && dto.observaciones !== undefined)
      data.observaciones = dto.observaciones;
    if ('planTratamiento' in dto && dto.planTratamiento !== undefined)
      data.planTratamiento = dto.planTratamiento;
    return data;
  }
}
