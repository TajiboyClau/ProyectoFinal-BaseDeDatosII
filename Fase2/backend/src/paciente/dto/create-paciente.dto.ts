import {
  DpiGuatemala,
  TelefonoGuatemala,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreatePacienteDto {
  @Texto(100, false)
  pacienteNombre: string;

  @Texto(100, false)
  pacienteApellido: string;

  @DpiGuatemala(true)
  pacienteDpi?: string | null;

  @TelefonoGuatemala(true)
  pacienteTelefono?: string | null;
}
