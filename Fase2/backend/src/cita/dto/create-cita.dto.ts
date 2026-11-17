import {
  Referencia,
  Fecha,
  Hora,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreateCitaDto {
  @Referencia(false)
  pacienteId: number;

  @Referencia(false)
  doctorId: number;

  @Referencia(true)
  enfermeroId?: number | null;

  @Referencia(false)
  consultorioId: number;

  @Fecha(false)
  fechaCita: string;

  @Hora(false)
  horaCita: string;

  @Texto(50, true)
  estadoCita?: string | null;

  @Texto(200, true)
  motivoCita?: string | null;
}
