import {
  DpiGuatemala,
  Fecha,
  Hora,
  TelefonoGuatemala,
  Texto,
} from '../../common/validacion.decoradores.js';

export class SolicitudCitaPublicaDto {
  @Texto(100)
  pacienteNombre: string;

  @Texto(100)
  pacienteApellido: string;

  @DpiGuatemala(true)
  pacienteDpi?: string | null;

  @TelefonoGuatemala()
  pacienteTelefono: string;

  @Fecha()
  fechaCita: string;

  @Hora()
  horaCita: string;

  @Texto(200, true)
  motivoCita?: string | null;
}
