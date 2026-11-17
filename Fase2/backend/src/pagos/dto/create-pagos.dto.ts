import {
  Referencia,
  Decimal,
  FechaHora,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreatePagosDto {
  @Referencia(false)
  citaId: number;

  @Referencia(false)
  tipoPagoId: number;

  @Decimal(true, false)
  montoPago: number;

  @FechaHora(true)
  fechaPago?: string | null;

  @Texto(50, true)
  estadoPago?: string | null;
}
