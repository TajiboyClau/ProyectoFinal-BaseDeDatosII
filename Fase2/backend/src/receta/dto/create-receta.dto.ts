import { Referencia } from '../../common/validacion.decoradores.js';

export class CreateRecetaDto {
  @Referencia(false)
  consultaId: number;
}
