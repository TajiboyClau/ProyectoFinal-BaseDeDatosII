import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CitaRepositorio } from './entities/cita.repository.js';
import { Cita } from './entities/cita.entity.js';
import { CreateCitaDto } from './dto/create-cita.dto.js';
import { UpdateCitaDto } from './dto/update-cita.dto.js';
import { SolicitudCitaPublicaDto } from './dto/solicitud-cita-publica.dto.js';

@Injectable()
export class CitaService {
  constructor(private readonly repositorio: CitaRepositorio) {}

  findAll(): Promise<Cita[]> {
    return this.repositorio.findAll();
  }

  async findById(idCita: number): Promise<Cita> {
    const registro = await this.repositorio.findById(idCita);
    if (!registro)
      throw new NotFoundException('Registro de cita no encontrado');
    return registro;
  }

  async create(dto: CreateCitaDto): Promise<Cita> {
    const data = this.convertir(dto);
    await this.repositorio.validarReferencias(data);
    return this.repositorio.create(data);
  }

  async solicitarPublica(dto: SolicitudCitaPublicaDto): Promise<Cita> {
    const hoy = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Guatemala',
    }).format(new Date());
    if (dto.fechaCita < hoy) {
      throw new BadRequestException(
        'La fecha de la cita no puede estar en el pasado.',
      );
    }
    return this.repositorio.crearSolicitudPublica(dto);
  }

  async update(idCita: number, dto: UpdateCitaDto): Promise<Cita> {
    const data = this.convertir(dto);
    if (!Object.keys(data).length)
      throw new BadRequestException('Indica al menos un campo para actualizar');
    await this.findById(idCita);
    await this.repositorio.validarReferencias(data);
    const registro = await this.repositorio.update(idCita, data);
    if (!registro)
      throw new NotFoundException('Registro de cita no encontrado');
    return registro;
  }

  async delete(idCita: number): Promise<{ message: string }> {
    if (!(await this.repositorio.delete(idCita))) {
      throw new NotFoundException('Registro de cita no encontrado');
    }
    return { message: 'Registro de cita eliminado' };
  }

  private convertir(dto: CreateCitaDto | UpdateCitaDto): Partial<Cita> {
    const data: Partial<Cita> = {};
    if ('pacienteId' in dto && dto.pacienteId !== undefined)
      data.pacienteId = dto.pacienteId;
    if ('doctorId' in dto && dto.doctorId !== undefined)
      data.doctorId = dto.doctorId;
    if ('enfermeroId' in dto && dto.enfermeroId !== undefined)
      data.enfermeroId = dto.enfermeroId;
    if ('consultorioId' in dto && dto.consultorioId !== undefined)
      data.consultorioId = dto.consultorioId;
    if ('fechaCita' in dto && dto.fechaCita !== undefined)
      data.fechaCita = dto.fechaCita;
    if ('horaCita' in dto && dto.horaCita !== undefined)
      data.horaCita = dto.horaCita;
    if ('estadoCita' in dto && dto.estadoCita !== undefined)
      data.estadoCita = dto.estadoCita;
    if ('motivoCita' in dto && dto.motivoCita !== undefined)
      data.motivoCita = dto.motivoCita;
    return data;
  }
}
