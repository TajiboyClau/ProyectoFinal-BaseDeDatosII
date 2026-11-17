import { Referencia, Texto } from '../../common/validacion.decoradores.js';

export class CreateDiagnosticoDto {
  @Referencia(false)
  consultaId: number;

  @Texto(500, true)
  diagnostico?: string | null;
}
