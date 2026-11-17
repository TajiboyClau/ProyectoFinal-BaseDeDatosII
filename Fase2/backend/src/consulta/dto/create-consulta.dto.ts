import {
  Referencia,
  FechaHora,
  Texto,
} from '../../common/validacion.decoradores.js';

export class CreateConsultaDto {
  @Referencia(false)
  citaId: number;

  @FechaHora(true)
  fechaHoraInicio?: string | null;

  @Texto(200, true)
  motivoConsulta?: string | null;

  @Texto(500, true)
  sintomas?: string | null;

  @Texto(500, true)
  observaciones?: string | null;

  @Texto(500, true)
  planTratamiento?: string | null;
}
