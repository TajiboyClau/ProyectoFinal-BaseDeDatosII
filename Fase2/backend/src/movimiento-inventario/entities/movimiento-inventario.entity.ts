import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'movimiento_inventario', schema: 'public' })
export class MovimientoInventario {
  @PrimaryGeneratedColumn({ name: 'id_movimiento' })
  idMovimiento: number;

  @Column({ name: 'id_producto', type: 'int', nullable: true })
  idProducto: number | null;

  @Column({
    name: 'tipo_movimiento',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  tipoMovimiento: string | null;

  @Column({
    name: 'cantidad',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  cantidad: string | null;

  @Column({ name: 'fecha_movimiento', type: 'timestamp', nullable: true })
  fechaMovimiento: Date | null;
}
