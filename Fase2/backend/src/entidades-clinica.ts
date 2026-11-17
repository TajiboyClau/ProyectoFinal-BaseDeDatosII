import { Producto } from './producto/entities/producto.entity.js';
import { Especialidad } from './especialidad/entities/especialidad.entity.js';
import { Consultorio } from './consultorio/entities/consultorio.entity.js';
import { Paciente } from './paciente/entities/paciente.entity.js';
import { Doctor } from './doctor/entities/doctor.entity.js';
import { Enfermero } from './enfermero/entities/enfermero.entity.js';
import { Cita } from './cita/entities/cita.entity.js';
import { HistorialClinico } from './historial-clinico/entities/historial-clinico.entity.js';
import { Consulta } from './consulta/entities/consulta.entity.js';
import { Diagnostico } from './diagnostico/entities/diagnostico.entity.js';
import { Receta } from './receta/entities/receta.entity.js';
import { DetalleReceta } from './detalle-receta/entities/detalle-receta.entity.js';
import { MovimientoInventario } from './movimiento-inventario/entities/movimiento-inventario.entity.js';
import { TipoPago } from './tipo-pago/entities/tipo-pago.entity.js';
import { Venta } from './venta/entities/venta.entity.js';
import { DetalleVenta } from './detalle-venta/entities/detalle-venta.entity.js';
import { Pagos } from './pagos/entities/pagos.entity.js';

export const entidadesClinica = [
  Producto,
  Especialidad,
  Consultorio,
  Paciente,
  Doctor,
  Enfermero,
  Cita,
  HistorialClinico,
  Consulta,
  Diagnostico,
  Receta,
  DetalleReceta,
  MovimientoInventario,
  TipoPago,
  Venta,
  DetalleVenta,
  Pagos,
];
export const referenciasClinica = [
  {
    tabla: 'doctor',
    columna: 'doctor_especialidad',
    tablaReferencia: 'especialidad',
    columnaReferencia: 'id_especialidad',
  },
  {
    tabla: 'cita',
    columna: 'paciente_id',
    tablaReferencia: 'paciente',
    columnaReferencia: 'id_paciente',
  },
  {
    tabla: 'cita',
    columna: 'doctor_id',
    tablaReferencia: 'doctor',
    columnaReferencia: 'doctor_id',
  },
  {
    tabla: 'cita',
    columna: 'enfermero_id',
    tablaReferencia: 'enfermero',
    columnaReferencia: 'enfermero_id',
  },
  {
    tabla: 'cita',
    columna: 'consultorio_id',
    tablaReferencia: 'consultorio',
    columnaReferencia: 'id_consultorio',
  },
  {
    tabla: 'historial_clinico',
    columna: 'paciente_id',
    tablaReferencia: 'paciente',
    columnaReferencia: 'id_paciente',
  },
  {
    tabla: 'consulta',
    columna: 'cita_id',
    tablaReferencia: 'cita',
    columnaReferencia: 'id_cita',
  },
  {
    tabla: 'diagnostico',
    columna: 'consulta_id',
    tablaReferencia: 'consulta',
    columnaReferencia: 'id_consulta',
  },
  {
    tabla: 'receta',
    columna: 'consulta_id',
    tablaReferencia: 'consulta',
    columnaReferencia: 'id_consulta',
  },
  {
    tabla: 'detalle_receta',
    columna: 'id_receta',
    tablaReferencia: 'receta',
    columnaReferencia: 'id_receta',
  },
  {
    tabla: 'detalle_receta',
    columna: 'id_producto',
    tablaReferencia: 'producto',
    columnaReferencia: 'id_producto',
  },
  {
    tabla: 'movimiento_inventario',
    columna: 'id_producto',
    tablaReferencia: 'producto',
    columnaReferencia: 'id_producto',
  },
  {
    tabla: 'venta',
    columna: 'paciente_id',
    tablaReferencia: 'paciente',
    columnaReferencia: 'id_paciente',
  },
  {
    tabla: 'venta',
    columna: 'tipo_pago_id',
    tablaReferencia: 'tipo_pago',
    columnaReferencia: 'id_tipo_pago',
  },
  {
    tabla: 'detalle_venta',
    columna: 'id_venta',
    tablaReferencia: 'venta',
    columnaReferencia: 'id_venta',
  },
  {
    tabla: 'detalle_venta',
    columna: 'id_producto',
    tablaReferencia: 'producto',
    columnaReferencia: 'id_producto',
  },
  {
    tabla: 'pagos',
    columna: 'cita_id',
    tablaReferencia: 'cita',
    columnaReferencia: 'id_cita',
  },
  {
    tabla: 'pagos',
    columna: 'tipo_pago_id',
    tablaReferencia: 'tipo_pago',
    columnaReferencia: 'id_tipo_pago',
  },
] as const;
