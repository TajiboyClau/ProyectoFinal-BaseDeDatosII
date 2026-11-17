import {
  Referencia,
  FechaHora,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreateVentaDto {
  @Referencia(true)
  pacienteId?: number | null;

  @FechaHora(true)
  fechaVenta?: string | null;

  @Texto(50, true)
  estadoVenta?: string | null;

  @Referencia(false)
  tipoPagoId: number;
}
