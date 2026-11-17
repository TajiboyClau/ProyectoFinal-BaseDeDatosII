import {
  Referencia,
  Texto,
  Decimal,
} from '../../common/validacion.decoradores.js';

export class CreateDetalleRecetaDto {
  @Referencia(false)
  idReceta: number;

  @Referencia(false)
  idProducto: number;

  @Texto(100, true)
  detalleRecetaFrecuencia?: string | null;

  @Decimal(true, false)
  detalleRecetaCantidad: number;

  @Texto(100, true)
  viaAdministracion?: string | null;

  @Texto(250, true)
  observaciones?: string | null;
}
