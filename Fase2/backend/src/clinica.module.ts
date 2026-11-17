import { Module } from '@nestjs/common';
import { ProductoModule } from './producto/producto.module.js';
import { EspecialidadModule } from './especialidad/especialidad.module.js';
import { ConsultorioModule } from './consultorio/consultorio.module.js';
import { PacienteModule } from './paciente/paciente.module.js';
import { DoctorModule } from './doctor/doctor.module.js';
import { EnfermeroModule } from './enfermero/enfermero.module.js';
import { CitaModule } from './cita/cita.module.js';
import { HistorialClinicoModule } from './historial-clinico/historial-clinico.module.js';
import { ConsultaModule } from './consulta/consulta.module.js';
import { DiagnosticoModule } from './diagnostico/diagnostico.module.js';
import { RecetaModule } from './receta/receta.module.js';
import { DetalleRecetaModule } from './detalle-receta/detalle-receta.module.js';
import { MovimientoInventarioModule } from './movimiento-inventario/movimiento-inventario.module.js';
import { TipoPagoModule } from './tipo-pago/tipo-pago.module.js';
import { VentaModule } from './venta/venta.module.js';
import { DetalleVentaModule } from './detalle-venta/detalle-venta.module.js';
import { PagosModule } from './pagos/pagos.module.js';

// Agrupa los módulos funcionales de la clínica.
@Module({
  imports: [
    ProductoModule,
    EspecialidadModule,
    ConsultorioModule,
    PacienteModule,
    DoctorModule,
    EnfermeroModule,
    CitaModule,
    HistorialClinicoModule,
    ConsultaModule,
    DiagnosticoModule,
    RecetaModule,
    DetalleRecetaModule,
    MovimientoInventarioModule,
    TipoPagoModule,
    VentaModule,
    DetalleVentaModule,
    PagosModule,
  ],
})
export class ClinicaModule {}
