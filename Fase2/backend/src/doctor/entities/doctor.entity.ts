import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'doctor', schema: 'public' })
export class Doctor {
  @PrimaryGeneratedColumn({ name: 'doctor_id' })
  doctorId: number;

  @Column({
    name: 'doctor_nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  doctorNombre: string;

  @Column({
    name: 'doctor_apellido',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  doctorApellido: string;

  @Column({ name: 'doctor_especialidad', type: 'int', nullable: true })
  doctorEspecialidad: number | null;

  @Column({ name: 'telefono', type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Column({ name: 'correo', type: 'varchar', length: 100, nullable: true })
  correo: string | null;
}
