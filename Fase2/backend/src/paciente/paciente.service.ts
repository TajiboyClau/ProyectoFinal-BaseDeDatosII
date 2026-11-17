import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PacienteRepositorio } from './entities/paciente.repository.js';
import { Paciente } from './entities/paciente.entity.js';
import { CreatePacienteDto } from './dto/create-paciente.dto.js';
import { UpdatePacienteDto } from './dto/update-paciente.dto.js';

@Injectable()
export class PacienteService {
  constructor(private readonly repositorio: PacienteRepositorio) {}

  findAll(): Promise<Paciente[]> {
    return this.repositorio.findAll();
  }

  async findById(idPaciente: number): Promise<Paciente> {
    const registro = await this.repositorio.findById(idPaciente);
    if (!registro)
      throw new NotFoundException('Registro de paciente no encontrado');
    return registro;
  }

  async create(dto: CreatePacienteDto): Promise<Paciente> {
    const data = this.convertir(dto);
    return this.repositorio.create(data);
  }

  async update(idPaciente: number, dto: UpdatePacienteDto): Promise<Paciente> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idPaciente);
    const registro = await this.repositorio.update(idPaciente, data);
    if (!registro)
      throw new NotFoundException('Registro de paciente no encontrado');
    return registro;
  }

  async delete(idPaciente: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idPaciente))) {
      throw new NotFoundException('Registro de paciente no encontrado');
    }
    return { message: 'Registro de paciente eliminado' };
  }

  private convertir(
    dto: CreatePacienteDto | UpdatePacienteDto,
  ): Partial<Paciente> {
    const data: Partial<Paciente> = {};
    if ('pacienteNombre' in dto && dto.pacienteNombre !== undefined)
      data.pacienteNombre = dto.pacienteNombre;
    if ('pacienteApellido' in dto && dto.pacienteApellido !== undefined)
      data.pacienteApellido = dto.pacienteApellido;
    if ('pacienteDpi' in dto && dto.pacienteDpi !== undefined)
      data.pacienteDpi = dto.pacienteDpi;
    if ('pacienteTelefono' in dto && dto.pacienteTelefono !== undefined)
      data.pacienteTelefono = dto.pacienteTelefono;
    return data;
  }
}
