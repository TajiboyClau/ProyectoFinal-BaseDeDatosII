import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'consultorio', schema: 'public' })
export class Consultorio {
  @PrimaryGeneratedColumn({ name: 'id_consultorio' })
  idConsultorio: number;

  @Column({
    name: 'nombre_consultorio',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  nombreConsultorio: string;
}
