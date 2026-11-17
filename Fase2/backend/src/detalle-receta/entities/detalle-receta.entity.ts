import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'detalle_receta', schema: 'public' })
export class DetalleReceta {
  @PrimaryColumn({ name: 'id_receta', type: 'int' })
  idReceta: number;

  @PrimaryColumn({ name: 'id_producto', type: 'int' })
  idProducto: number;

  @Column({
    name: 'detalle_receta_frecuencia',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  detalleRecetaFrecuencia: string | null;

  @Column({
    name: 'detalle_receta_cantidad',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  detalleRecetaCantidad: string | null;

  @Column({
    name: 'via_administracion',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  viaAdministracion: string | null;

  @Column({
    name: 'observaciones',
    type: 'varchar',
    length: 250,
    nullable: true,
  })
  observaciones: string | null;
}
