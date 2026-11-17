import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('producto') //Se tiene que llamar igual que en la bd
export class Producto {
  @PrimaryGeneratedColumn({ name: 'id_producto' }) //Como se llama en la bd
  idProducto: number; //Aqui como lo vamos a llamar en el codigo

  @Column({ name: 'nombre_producto', type: 'varchar', length: 100 })
  nombreProducto: string;

  @Column({ name: 'precio_producto', type: 'numeric', precision: 10, scale: 2 })
  precioProducto: string;

  @Column({ name: 'estado_producto', type: 'boolean', default: true })
  estadoProducto: boolean;
}
