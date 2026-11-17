import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'venta', schema: 'public' })
export class Venta {
  @PrimaryGeneratedColumn({ name: 'id_venta' })
  idVenta: number;

  @Column({ name: 'paciente_id', type: 'int', nullable: true })
  pacienteId: number | null;

  @Column({ name: 'fecha_venta', type: 'timestamp', nullable: true })
  fechaVenta: Date | null;

  @Column({ name: 'estado_venta', type: 'varchar', length: 50, nullable: true })
  estadoVenta: string | null;

  @Column({ name: 'tipo_pago_id', type: 'int', nullable: true })
  tipoPagoId: number | null;
}
