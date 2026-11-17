import {
  Referencia,
  Texto,
  Decimal,
  FechaHora,
} from '../../common/validacion.decoradores.js';

export class CreateMovimientoInventarioDto {
  @Referencia(false)
  idProducto: number;

  @Texto(50, true)
  tipoMovimiento?: string | null;

  @Decimal(true, false)
  cantidad: number;

  @FechaHora(true)
  fechaMovimiento?: string | null;
}
