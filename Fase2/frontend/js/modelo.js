const text = (key, label, maxLength = 100, required = false) => ({
  key,
  label,
  kind: maxLength >= 200 ? "textarea" : "text",
  maxLength,
  required,
});
const ref = (key, label, reference, required = true) => ({
  key,
  label,
  reference,
  required,
  kind: "reference",
});
const date = (key, label, kind = "date", required = false) => ({
  key,
  label,
  kind,
  required,
});
const num = (key, label, min = 0.01, required = true, money = false) => ({
  key,
  label,
  kind: "number",
  min,
  required,
  money,
});
const status = (key, options) => ({
  key,
  label: "Estado",
  kind: "select",
  maxLength: 50,
  options,
});
function module(
  id,
  title,
  singular,
  description,
  group,
  icon,
  keys,
  fields,
  columns,
  nameFields,
  statusKey,
) {
  return {
    id,
    title,
    singular,
    description,
    group,
    icon,
    keys,
    fields,
    columns,
    nameFields,
    status: statusKey,
  };
}
export const modulos = [
  module(
    "paciente",
    "Pacientes",
    "paciente",
    "Cada persona, una atención cercana.",
    "Atención clínica",
    "users",
    ["idPaciente"],
    [
      text("pacienteNombre", "Nombres", 100, true),
      text("pacienteApellido", "Apellidos", 100, true),
      text("pacienteDpi", "DPI", 30),
      text("pacienteTelefono", "Teléfono", 30),
    ],
    ["pacienteNombre", "pacienteApellido", "pacienteDpi", "pacienteTelefono"],
    ["pacienteNombre", "pacienteApellido"],
  ),
  module(
    "cita",
    "Citas",
    "cita",
    "Organiza la agenda y las próximas visitas.",
    "Atención clínica",
    "calendar",
    ["idCita"],
    [
      ref("pacienteId", "Paciente", "paciente"),
      ref("doctorId", "Doctor", "doctor"),
      ref("enfermeroId", "Enfermero", "enfermero", false),
      ref("consultorioId", "Consultorio", "consultorio"),
      date("fechaCita", "Fecha", "date", true),
      date("horaCita", "Hora", "time", true),
      status("estadoCita", [
        "Solicitada",
        "Programada",
        "Atendida",
        "Cancelada",
      ]),
      text("motivoCita", "Motivo", 200),
    ],
    ["pacienteId", "doctorId", "fechaCita", "horaCita", "estadoCita"],
    [],
    "estadoCita",
  ),
  module(
    "historial-clinico",
    "Historiales clínicos",
    "historial clínico",
    "La información del paciente, en un mismo lugar.",
    "Atención clínica",
    "folder",
    ["idHistorial"],
    [
      ref("pacienteId", "Paciente", "paciente"),
      date("fechaApertura", "Fecha de apertura"),
      text("grupoSanguineo", "Grupo sanguíneo", 10),
      text("alergias", "Alergias", 250),
      text("antecedentes", "Antecedentes", 250),
      status("estadoHistorial", ["Activo", "Inactivo"]),
    ],
    ["pacienteId", "fechaApertura", "grupoSanguineo", "estadoHistorial"],
    [],
    "estadoHistorial",
  ),
  module(
    "consulta",
    "Consultas",
    "consulta",
    "Registra la atención vinculada a cada cita.",
    "Atención clínica",
    "stethoscope",
    ["idConsulta"],
    [
      ref("citaId", "Cita", "cita"),
      date("fechaHoraInicio", "Inicio de la consulta", "timestamp"),
      text("motivoConsulta", "Motivo", 200),
      text("sintomas", "Síntomas", 500),
      text("observaciones", "Observaciones", 500),
      text("planTratamiento", "Plan de tratamiento", 500),
    ],
    ["citaId", "fechaHoraInicio", "motivoConsulta", "observaciones"],
    [],
  ),
  module(
    "diagnostico",
    "Diagnósticos",
    "diagnóstico",
    "Consulta las anotaciones de cada atención.",
    "Atención clínica",
    "clipboard",
    ["idDiagnostico"],
    [
      ref("consultaId", "Consulta", "consulta"),
      text("diagnostico", "Descripción del diagnóstico", 500),
    ],
    ["consultaId", "diagnostico"],
    [],
  ),
  module(
    "receta",
    "Recetas",
    "receta",
    "Relaciona cada receta con su consulta médica.",
    "Atención clínica",
    "file",
    ["idReceta"],
    [ref("consultaId", "Consulta", "consulta")],
    ["consultaId"],
    [],
  ),
  module(
    "detalle-receta",
    "Detalle de recetas",
    "detalle de receta",
    "Productos e indicaciones de cada receta.",
    "Atención clínica",
    "list",
    ["idReceta", "idProducto"],
    [
      ref("idReceta", "Receta", "receta"),
      ref("idProducto", "Producto", "producto"),
      text("detalleRecetaFrecuencia", "Frecuencia", 100),
      num("detalleRecetaCantidad", "Cantidad"),
      text("viaAdministracion", "Vía de administración"),
      text("observaciones", "Observaciones", 250),
    ],
    [
      "idReceta",
      "idProducto",
      "detalleRecetaCantidad",
      "detalleRecetaFrecuencia",
    ],
    [],
  ),
  module(
    "doctor",
    "Doctores",
    "doctor",
    "Conoce y administra el equipo médico.",
    "Equipo",
    "stethoscope",
    ["doctorId"],
    [
      text("doctorNombre", "Nombres", 100, true),
      text("doctorApellido", "Apellidos", 100, true),
      ref("doctorEspecialidad", "Especialidad", "especialidad", false),
      text("telefono", "Teléfono", 30),
      text("correo", "Correo", 100),
    ],
    [
      "doctorNombre",
      "doctorApellido",
      "doctorEspecialidad",
      "telefono",
      "correo",
    ],
    ["doctorNombre", "doctorApellido"],
  ),
  module(
    "enfermero",
    "Enfermeros",
    "enfermero",
    "El equipo que acompaña la atención.",
    "Equipo",
    "heart",
    ["enfermeroId"],
    [
      text("enfermeroNombre", "Nombres", 100, true),
      text("enfermeroApellido", "Apellidos", 100, true),
    ],
    ["enfermeroNombre", "enfermeroApellido"],
    ["enfermeroNombre", "enfermeroApellido"],
  ),
  module(
    "producto",
    "Farmacia",
    "producto",
    "Medicamentos e insumos para la clínica y venta al público.",
    "Farmacia y pagos",
    "pill",
    ["idProducto"],
    [
      text("nombreProducto", "Nombre del producto", 100, true),
      num("precioProducto", "Precio", 0.01, true, true),
      { key: "estadoProducto", label: "Estado", kind: "boolean" },
    ],
    ["nombreProducto", "precioProducto", "estadoProducto"],
    ["nombreProducto"],
    "estadoProducto",
  ),
  module(
    "movimiento-inventario",
    "Inventario",
    "movimiento de inventario",
    "Registra entradas y salidas de productos.",
    "Farmacia y pagos",
    "box",
    ["idMovimiento"],
    [
      ref("idProducto", "Producto", "producto"),
      {
        key: "tipoMovimiento",
        label: "Tipo de movimiento",
        kind: "select",
        maxLength: 50,
        options: ["Entrada", "Salida"],
      },
      num("cantidad", "Cantidad"),
      date("fechaMovimiento", "Fecha y hora", "timestamp"),
    ],
    ["idProducto", "tipoMovimiento", "cantidad", "fechaMovimiento"],
    [],
    "tipoMovimiento",
  ),
  module(
    "venta",
    "Ventas",
    "venta",
    "Atiende a pacientes y al público general.",
    "Farmacia y pagos",
    "bag",
    ["idVenta"],
    [
      ref("pacienteId", "Paciente (opcional)", "paciente", false),
      ref("tipoPagoId", "Tipo de pago", "tipo-pago"),
      date("fechaVenta", "Fecha y hora", "timestamp"),
      status("estadoVenta", ["Completada", "Pendiente", "Anulada"]),
    ],
    ["pacienteId", "tipoPagoId", "fechaVenta", "estadoVenta"],
    [],
    "estadoVenta",
  ),
  module(
    "detalle-venta",
    "Detalle de ventas",
    "detalle de venta",
    "Productos, cantidades y precios de cada venta.",
    "Farmacia y pagos",
    "list",
    ["idVenta", "idProducto"],
    [
      ref("idVenta", "Venta", "venta"),
      ref("idProducto", "Producto", "producto"),
      num("detalleVentaCantidad", "Cantidad"),
      num("detalleVentaPrecio", "Precio unitario", 0.01, true, true),
      num("detalleVentaDescuento", "Descuento", 0, false, true),
    ],
    [
      "idVenta",
      "idProducto",
      "detalleVentaCantidad",
      "detalleVentaPrecio",
      "detalleVentaDescuento",
    ],
    [],
  ),
  module(
    "pagos",
    "Pagos de consultas",
    "pago",
    "Lleva el control de los pagos de las citas.",
    "Farmacia y pagos",
    "wallet",
    ["idPago"],
    [
      ref("citaId", "Cita", "cita"),
      ref("tipoPagoId", "Tipo de pago", "tipo-pago"),
      num("montoPago", "Monto", 0.01, true, true),
      date("fechaPago", "Fecha y hora", "timestamp"),
      status("estadoPago", ["Pagado", "Pendiente", "Anulado"]),
    ],
    ["citaId", "tipoPagoId", "montoPago", "fechaPago", "estadoPago"],
    [],
    "estadoPago",
  ),
  module(
    "especialidad",
    "Especialidades",
    "especialidad",
    "Las áreas médicas disponibles en la clínica.",
    "Catálogos",
    "spark",
    ["idEspecialidad"],
    [text("nombreEspecialidad", "Nombre", 100, true)],
    ["nombreEspecialidad"],
    ["nombreEspecialidad"],
  ),
  module(
    "consultorio",
    "Consultorios",
    "consultorio",
    "Espacios para la atención médica.",
    "Catálogos",
    "door",
    ["idConsultorio"],
    [text("nombreConsultorio", "Nombre", 100, true)],
    ["nombreConsultorio"],
    ["nombreConsultorio"],
  ),
  module(
    "tipo-pago",
    "Tipos de pago",
    "tipo de pago",
    "Opciones de cobro para clínica y farmacia.",
    "Catálogos",
    "card",
    ["idTipoPago"],
    [text("nombreTipoPago", "Nombre", 50, true)],
    ["nombreTipoPago"],
    ["nombreTipoPago"],
  ),
];
export const buscarModulo = (id) => {
  const result = modulos.find((m) => m.id === id);
  if (!result) throw new Error("Módulo desconocido");
  return result;
};
export function claveRegistro(m, row) {
  return m.keys.map((k) => String(row[k])).join("/");
}
export function fechaLocal(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
}
export const formatearMoneda = (value) =>
  new Intl.NumberFormat("es-GT", { style: "currency", currency: "GTQ" }).format(
    Number(value ?? 0),
  );
export function nombreRegistro(m, row, db, depth = 0) {
  if (m.id === "cita") {
    const paciente = (db.paciente ?? []).find(
      (registro) => String(registro.idPaciente) === String(row.pacienteId),
    );
    const nombrePaciente = paciente
      ? nombreRegistro(buscarModulo("paciente"), paciente, db, depth + 1)
      : "";
    const fecha = row.fechaCita
      ? mostrarDato(m, row, "fechaCita", db)
      : "";
    const hora = row.horaCita ? String(row.horaCita).slice(0, 5) : "";
    const detalle = [nombrePaciente, fecha, hora].filter(Boolean).join(" · ");
    return detalle ? `Cita #${row.idCita} · ${detalle}` : `Cita #${row.idCita}`;
  }
  const name = m.nameFields
    .map((k) => row[k])
    .filter(Boolean)
    .join(" ");
  if (name) return name;
  const key = claveRegistro(m, row);
  if (depth < 2) {
    const firstRef = m.fields.find((f) => f.kind === "reference");
    const target = firstRef && buscarModulo(firstRef.reference);
    const related =
      target &&
      (db[target.id] ?? []).find(
        (r) => r[target.keys[0]] === row[firstRef.key],
      );
    if (target && related)
      return `#${key} · ${nombreRegistro(target, related, db, depth + 1)}`;
  }
  return `${m.singular} #${key}`;
}
export function mostrarDato(m, row, key, db) {
  const f = m.fields.find((f) => f.key === key);
  const value = row[key];
  if (value === null || value === undefined || value === "")
    return m.id === "venta" && key === "pacienteId" ? "Público general" : "—";
  if (f?.kind === "reference") {
    const target = buscarModulo(f.reference);
    const related = (db[target.id] ?? []).find(
      (r) => String(r[target.keys[0]]) === String(value),
    );
    return related ? nombreRegistro(target, related, db) : `#${value}`;
  }
  if (f?.money) return formatearMoneda(value);
  if (f?.kind === "boolean") return value ? "Activo" : "Inactivo";
  if (f?.kind === "time") return String(value).slice(0, 5);
  if (f?.kind === "date") {
    const [y, mo, d] = String(value).slice(0, 10).split("-");
    return `${d}/${mo}/${y}`;
  }
  if (f?.kind === "timestamp") {
    const d = new Date(String(value));
    return Number.isNaN(d.valueOf())
      ? String(value)
      : d.toLocaleString("es-GT", { dateStyle: "short", timeStyle: "short" });
  }
  return String(value);
}
