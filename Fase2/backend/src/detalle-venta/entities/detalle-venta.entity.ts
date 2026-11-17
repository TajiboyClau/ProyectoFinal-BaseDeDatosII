import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'detalle_venta', schema: 'public' })
export class DetalleVenta {
  @PrimaryColumn({ name: 'id_venta', type: 'int' })
  idVenta: number;

  @PrimaryColumn({ name: 'id_producto', type: 'int' })
  idProducto: number;

  @Column({
    name: 'detalle_venta_cantidad',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  detalleVentaCantidad: string | null;

  @Column({
    name: 'detalle_venta_precio',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  detalleVentaPrecio: string | null;

  @Column({
    name: 'detalle_venta_descuento',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  detalleVentaDescuento: string | null;
}
