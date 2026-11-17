import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'enfermero', schema: 'public' })
export class Enfermero {
  @PrimaryGeneratedColumn({ name: 'enfermero_id' })
  enfermeroId: number;

  @Column({
    name: 'enfermero_nombre',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  enfermeroNombre: string;

  @Column({
    name: 'enfermero_apellido',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  enfermeroApellido: string;
}
