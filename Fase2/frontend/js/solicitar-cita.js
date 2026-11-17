import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

function fechaLocal() {
  const ahora = new Date();
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset());
  return ahora.toISOString().slice(0, 10);
}

function soloDigitos(valor, maximo) {
  return valor.replace(/\D/g, '').slice(0, maximo);
}

function mostrarDpi(valor) {
  const digitos = soloDigitos(valor, 13);
  return [digitos.slice(0, 4), digitos.slice(4, 9), digitos.slice(9, 13)]
    .filter(Boolean)
    .join('-');
}

export default function SolicitarCita({ alSolicitar, alVolver }) {
  const [datos, setDatos] = useState({
    pacienteNombre: "",
    pacienteApellido: "",
    pacienteDpi: "",
    pacienteTelefono: "",
    fechaCita: "",
    horaCita: "",
    motivoCita: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [ocupado, setOcupado] = useState(false);

  function cambiar(evento) {
    const nombre = evento.target.name;
    const valor =
      nombre === 'pacienteDpi'
        ? mostrarDpi(evento.target.value)
        : nombre === 'pacienteTelefono'
          ? soloDigitos(evento.target.value, 8)
          : evento.target.value;
    setDatos((actuales) => ({
      ...actuales,
      [nombre]: valor,
    }));
    setError("");
    setMensaje("");
  }

  async function enviar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(datos.horaCita)) {
      setError("Escribe la hora en formato de 24 horas, por ejemplo 09:30.");
      return;
    }
    setOcupado(true);
    try {
      const solicitud = { ...datos };
      solicitud.pacienteDpi = soloDigitos(solicitud.pacienteDpi, 13) || null;
      solicitud.pacienteTelefono = soloDigitos(solicitud.pacienteTelefono, 8);
      for (const campo of ["pacienteDpi", "motivoCita"]) {
        if (!solicitud[campo].trim()) solicitud[campo] = null;
      }
      await alSolicitar(solicitud);
      setMensaje(
        "Recibimos tu solicitud. La clínica debe confirmarte la cita.",
      );
      setDatos({
        pacienteNombre: "",
        pacienteApellido: "",
        pacienteDpi: "",
        pacienteTelefono: "",
        fechaCita: "",
        horaCita: "",
        motivoCita: "",
      });
    } catch (problema) {
      setError(
        problema instanceof Error
          ? problema.message
          : "No se pudo enviar la solicitud.",
      );
    } finally {
      setOcupado(false);
    }
  }

  function campo(nombre, etiqueta, tipo = "text", requerido = true) {
    return jsx(
      "label",
      {
        className:
          "login-field solicitar-campo" +
          (nombre === "motivoCita" ? " solicitar-campo-ancho" : ""),
        children: [
          jsx("span", { children: etiqueta }, "etiqueta"),
          jsx(
            "span",
            {
              className: "login-input",
              children:
                nombre === 'pacienteTelefono'
                  ? jsxs('span', {
                      className: 'telefono-campo',
                      children: [
                        jsx('span', { className: 'telefono-prefijo', children: '+502' }),
                        jsx('input', {
                          name: nombre,
                          type: tipo,
                          value: datos[nombre],
                          inputMode: 'numeric',
                          maxLength: 8,
                          placeholder: '12345678',
                          required: requerido,
                          onChange: cambiar,
                        }),
                      ],
                    })
                  : jsx("input", {
                      name: nombre,
                      type: tipo,
                      value:
                        nombre === 'pacienteDpi'
                          ? mostrarDpi(datos[nombre])
                          : datos[nombre],
                      inputMode:
                        nombre === 'pacienteDpi'
                          ? 'numeric'
                          : nombre === 'horaCita'
                            ? 'text'
                            : undefined,
                      maxLength:
                        nombre === 'pacienteDpi'
                          ? 15
                          : nombre === 'horaCita'
                            ? 5
                            : undefined,
                      placeholder:
                        nombre === 'pacienteDpi'
                          ? '0000-00000-0000'
                          : nombre === 'horaCita'
                            ? 'HH:MM (ejemplo: 09:30)'
                            : undefined,
                      min: tipo === "date" ? fechaLocal() : undefined,
                      required: requerido,
                      onChange: cambiar,
                    }),
            },
            "entrada",
          ),
        ],
      },
      nombre,
    );
  }

  return jsxs("section", {
    className: "solicitar-panel",
    id: "solicitar-cita",
    "aria-labelledby": "solicitar-titulo",
    children: [
      jsxs("header", {
        className: "solicitar-encabezado",
        children: [
          jsx("button", {
            type: "button",
            className: "solicitar-volver",
            onClick: alVolver,
            children: "← Volver a iniciar sesión",
          }),
          jsx("p", {
            className: "eyebrow",
            children: "CITAS PARA PACIENTES",
          }),
          jsx("h2", {
            id: "solicitar-titulo",
            children: "Solicitar cita",
          }),
          jsx("p", {
            className: "solicitar-subtitulo",
            children:
              "Comparte tus datos y te contactaremos para confirmar el horario y el profesional.",
          }),
        ],
      }),
      jsxs("form", {
        className: "solicitar-formulario",
        onSubmit: enviar,
        children: [
          jsx("p", {
            className: "appointment-help solicitar-ayuda",
            children:
              "No necesitas iniciar sesión para enviar la solicitud.",
          }),
          campo("pacienteNombre", "Nombre"),
          campo("pacienteApellido", "Apellido"),
          campo("pacienteDpi", "DPI (opcional)", "text", false),
          campo("pacienteTelefono", "Teléfono"),
          campo("fechaCita", "Fecha que prefieres", "date"),
          campo("horaCita", "Hora que prefieres", "text"),
          campo("motivoCita", "Motivo (opcional)", "text", false),
          error &&
            jsx("p", {
              className: "login-error",
              role: "alert",
              children: error,
            }),
          mensaje &&
            jsx("p", {
              className: "appointment-success solicitar-mensaje",
              role: "status",
              children: mensaje,
            }),
          jsx("p", {
            className: "solicitar-nota",
            children: "La cita quedará pendiente hasta que la clínica la confirme.",
          }),
          jsx("button", {
            type: "submit",
            className: "btn primary login-submit",
            disabled: ocupado,
            children: ocupado ? "Enviando…" : "Enviar solicitud",
          }),
        ],
      }),
    ],
  });
}
