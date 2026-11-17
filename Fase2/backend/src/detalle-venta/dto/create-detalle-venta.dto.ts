import { Referencia, Decimal } from '../../common/validacion.decoradores.js';

export class CreateDetalleVentaDto {
  @Referencia(false)
  idVenta: number;

  @Referencia(false)
  idProducto: number;

  @Decimal(true, false)
  detalleVentaCantidad: number;

  @Decimal(true, false)
  detalleVentaPrecio: number;

  @Decimal(false, true)
  detalleVentaDescuento?: number | null;
}
