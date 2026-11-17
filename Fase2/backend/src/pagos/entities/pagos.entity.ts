import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pagos', schema: 'public' })
export class Pagos {
  @PrimaryGeneratedColumn({ name: 'id_pago' })
  idPago: number;

  @Column({ name: 'cita_id', type: 'int', nullable: true })
  citaId: number | null;

  @Column({ name: 'tipo_pago_id', type: 'int', nullable: true })
  tipoPagoId: number | null;

  @Column({
    name: 'monto_pago',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  montoPago: string | null;

  @Column({ name: 'fecha_pago', type: 'timestamp', nullable: true })
  fechaPago: Date | null;

  @Column({ name: 'estado_pago', type: 'varchar', length: 50, nullable: true })
  estadoPago: string | null;
}
