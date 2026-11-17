import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'consulta', schema: 'public' })
export class Consulta {
  @PrimaryGeneratedColumn({ name: 'id_consulta' })
  idConsulta: number;

  @Column({ name: 'cita_id', type: 'int', nullable: true })
  citaId: number | null;

  @Column({ name: 'fecha_hora_inicio', type: 'timestamp', nullable: true })
  fechaHoraInicio: Date | null;

  @Column({
    name: 'motivo_consulta',
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  motivoConsulta: string | null;

  @Column({ name: 'sintomas', type: 'varchar', length: 500, nullable: true })
  sintomas: string | null;

  @Column({
    name: 'observaciones',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  observaciones: string | null;

  @Column({
    name: 'plan_tratamiento',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  planTratamiento: string | null;
}
