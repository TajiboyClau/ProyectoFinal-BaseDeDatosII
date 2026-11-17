import {
  Referencia,
  Fecha,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreateHistorialClinicoDto {
  @Referencia(false)
  pacienteId: number;

  @Fecha(true)
  fechaApertura?: string | null;

  @Texto(10, true)
  grupoSanguineo?: string | null;

  @Texto(250, true)
  alergias?: string | null;

  @Texto(250, true)
  antecedentes?: string | null;

  @Texto(50, true)
  estadoHistorial?: string | null;
}
