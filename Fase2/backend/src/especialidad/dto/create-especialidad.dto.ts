import { Texto } from '../../common/validacion.decoradores.js';

export class CreateEspecialidadDto {
  @Texto(100, false)
  nombreEspecialidad: string;
}
