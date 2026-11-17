import { Texto } from '../../common/validacion.decoradores.js';

export class CreateConsultorioDto {
  @Texto(100, false)
  nombreConsultorio: string;
}
