import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'diagnostico', schema: 'public' })
export class Diagnostico {
  @PrimaryGeneratedColumn({ name: 'id_diagnostico' })
  idDiagnostico: number;

  @Column({ name: 'consulta_id', type: 'int', nullable: true })
  consultaId: number | null;

  @Column({ name: 'diagnostico', type: 'varchar', length: 500, nullable: true })
  diagnostico: string | null;
}
