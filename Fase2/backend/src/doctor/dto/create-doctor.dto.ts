import {
  Referencia,
  TelefonoGuatemala,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreateDoctorDto {
  @Texto(100, false)
  doctorNombre: string;

  @Texto(100, false)
  doctorApellido: string;

  @Referencia(true)
  doctorEspecialidad?: number | null;

  @TelefonoGuatemala(true)
  telefono?: string | null;

  @Texto(100, true)
  correo?: string | null;
}
