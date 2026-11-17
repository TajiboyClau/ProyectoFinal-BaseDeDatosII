import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'paciente', schema: 'public' })
export class Paciente {
  @PrimaryGeneratedColumn({ name: 'id_paciente' })
  idPaciente: number;

  @Column({
    name: 'paciente_nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  pacienteNombre: string;

  @Column({
    name: 'paciente_apellido',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  pacienteApellido: string;

  @Column({ name: 'paciente_dpi', type: 'varchar', length: 30, nullable: true })
  pacienteDpi: string | null;

  @Column({
    name: 'paciente_telefono',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  pacienteTelefono: string | null;
}
