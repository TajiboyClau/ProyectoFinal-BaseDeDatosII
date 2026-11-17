import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'receta', schema: 'public' })
export class Receta {
  @PrimaryGeneratedColumn({ name: 'id_receta' })
  idReceta: number;

  @Column({ name: 'consulta_id', type: 'int', nullable: true })
  consultaId: number | null;
}
