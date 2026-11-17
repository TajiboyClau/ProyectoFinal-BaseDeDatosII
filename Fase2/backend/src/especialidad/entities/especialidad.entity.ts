import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'especialidad', schema: 'public' })
export class Especialidad {
  @PrimaryGeneratedColumn({ name: 'id_especialidad' })
  idEspecialidad: number;

  @Column({
    name: 'nombre_especialidad',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombreEspecialidad: string;
}
