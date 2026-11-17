import { Texto } from '../../common/validacion.decoradores.js';

export class CreateEnfermeroDto {
  @Texto(100, false)
  enfermeroNombre: string;

  @Texto(100, false)
  enfermeroApellido: string;
}
