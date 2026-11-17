import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tipo_pago', schema: 'public' })
export class TipoPago {
  @PrimaryGeneratedColumn({ name: 'id_tipo_pago' })
  idTipoPago: number;

  @Column({
    name: 'nombre_tipo_pago',
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  nombreTipoPago: string;
}
