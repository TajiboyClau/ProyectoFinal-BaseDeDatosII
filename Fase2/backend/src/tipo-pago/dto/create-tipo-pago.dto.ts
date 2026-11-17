import { Texto } from '../../common/validacion.decoradores.js';

export class CreateTipoPagoDto {
  @Texto(50, false)
  nombreTipoPago: string;
}
