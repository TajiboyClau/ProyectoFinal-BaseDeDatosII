import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cita', schema: 'public' })
export class Cita {
  @PrimaryGeneratedColumn({ name: 'id_cita' })
  idCita: number;

  @Column({ name: 'paciente_id', type: 'int', nullable: true })
  pacienteId: number | null;

  @Column({ name: 'doctor_id', type: 'int', nullable: true })
  doctorId: number | null;

  @Column({ name: 'enfermero_id', type: 'int', nullable: true })
  enfermeroId: number | null;

  @Column({ name: 'consultorio_id', type: 'int', nullable: true })
  consultorioId: number | null;

  @Column({ name: 'fecha_cita', type: 'date', nullable: true })
  fechaCita: string | null;

  @Column({ name: 'hora_cita', type: 'time', nullable: true })
  horaCita: string | null;

  @Column({ name: 'estado_cita', type: 'varchar', length: 50, nullable: true })
  estadoCita: string | null;

  @Column({ name: 'motivo_cita', type: 'varchar', length: 200, nullable: true })
  motivoCita: string | null;
}
