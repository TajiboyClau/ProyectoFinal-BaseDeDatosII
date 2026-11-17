import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Cita } from './cita.entity.js';
import { Paciente } from '../../paciente/entities/paciente.entity.js';
import { Doctor } from '../../doctor/entities/doctor.entity.js';
import { Enfermero } from '../../enfermero/entities/enfermero.entity.js';
import { Consultorio } from '../../consultorio/entities/consultorio.entity.js';
import { SolicitudCitaPublicaDto } from '../dto/solicitud-cita-publica.dto.js';

@Injectable()
export class CitaRepositorio {
  constructor(
    @InjectRepository(Cita) private readonly repo: Repository<Cita>,
  ) {}

  findAll(): Promise<Cita[]> {
    return this.repo.find({ order: { idCita: 'ASC' } });
  }

  findById(idCita: number): Promise<Cita | null> {
    return this.repo.findOneBy({ idCita });
  }

  async create(data: Partial<Cita>): Promise<Cita> {
    // INSERT conserva el error de duplicado; no sobrescribe un detalle existente.
    const resultado = await this.repo.insert(this.repo.create(data));
    return this.repo.findOneByOrFail(
      resultado.identifiers[0] as FindOptionsWhere<Cita>,
    );
  }

  async crearSolicitudPublica(
    solicitud: SolicitudCitaPublicaDto,
  ): Promise<Cita> {
    return this.repo.manager.transaction(async (manager) => {
      const pacientes = manager.getRepository(Paciente);
      let paciente: Paciente | null = null;
      const dpi = solicitud.pacienteDpi?.trim();

      if (dpi) {
        const encontrados = await pacientes.find({
          where: { pacienteDpi: dpi },
          take: 2,
        });
        if (encontrados.length > 1) {
          throw new BadRequestException(
            'Hay más de un paciente con ese DPI; llama a la clínica para solicitar la cita.',
          );
        }
        paciente = encontrados[0] ?? null;
      }

      if (!paciente) {
        paciente = await pacientes.save(
          pacientes.create({
            pacienteNombre: solicitud.pacienteNombre,
            pacienteApellido: solicitud.pacienteApellido,
            pacienteDpi: dpi || null,
            pacienteTelefono: solicitud.pacienteTelefono,
          }),
        );
      }

      const citas = manager.getRepository(Cita);
      return citas.save(
        citas.create({
          pacienteId: paciente.idPaciente,
          doctorId: null,
          enfermeroId: null,
          consultorioId: null,
          fechaCita: solicitud.fechaCita,
          horaCita: solicitud.horaCita,
          estadoCita: 'Solicitada',
          motivoCita: solicitud.motivoCita?.trim() || null,
        }),
      );
    });
  }

  async update(idCita: number, data: Partial<Cita>): Promise<Cita | null> {
    const resultado = await this.repo.update({ idCita }, data);
    if (!resultado.affected) return null;
    return this.findById(idCita);
  }

  async delete(idCita: number): Promise<boolean> {
    const resultado = await this.repo.delete({ idCita });
    return (resultado.affected ?? 0) > 0;
  }

  async validarReferencias(data: Partial<Cita>): Promise<void> {
    if (
      data.pacienteId !== undefined &&
      data.pacienteId !== null &&
      !(await this.repo.manager.existsBy(Paciente, {
        idPaciente: data.pacienteId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia paciente_id');
    }
    if (
      data.doctorId !== undefined &&
      data.doctorId !== null &&
      !(await this.repo.manager.existsBy(Doctor, { doctorId: data.doctorId }))
    ) {
      throw new BadRequestException('No existe la referencia doctor_id');
    }
    if (
      data.enfermeroId !== undefined &&
      data.enfermeroId !== null &&
      !(await this.repo.manager.existsBy(Enfermero, {
        enfermeroId: data.enfermeroId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia enfermero_id');
    }
    if (
      data.consultorioId !== undefined &&
      data.consultorioId !== null &&
      !(await this.repo.manager.existsBy(Consultorio, {
        idConsultorio: data.consultorioId,
      }))
    ) {
      throw new BadRequestException('No existe la referencia consultorio_id');
    }
  }
}
