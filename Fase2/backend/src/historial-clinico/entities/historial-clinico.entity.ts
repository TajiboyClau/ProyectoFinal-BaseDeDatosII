import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'historial_clinico', schema: 'public' })
export class HistorialClinico {
  @PrimaryGeneratedColumn({ name: 'id_historial' })
  idHistorial: number;

  @Column({ name: 'paciente_id', type: 'int', nullable: true })
  pacienteId: number | null;

  @Column({ name: 'fecha_apertura', type: 'date', nullable: true })
  fechaApertura: string | null;

  @Column({
    name: 'grupo_sanguineo',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  grupoSanguineo: string | null;

  @Column({ name: 'alergias', type: 'varchar', length: 250, nullable: true })
  alergias: string | null;

  @Column({
    name: 'antecedentes',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  antecedentes: string | null;

  @Column({
    name: 'estado_historial',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  estadoHistorial: string | null;
}
