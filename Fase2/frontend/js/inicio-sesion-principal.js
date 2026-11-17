import { jsx as crearElemento } from "react/jsx-runtime";
import React from "react";
import ReactDOM from "react-dom/client";
import { useEffect, useMemo, useState } from "react";
import InicioSesion from "./inicio-sesion.js";
import { iniciarSesionDoctor, validarSesionDoctor } from "./autenticacion.js";
import { RepositorioApi } from "./datos.js";
import "../css/inicio-sesion.css";
import "../css/identidad.css";

function Acceso() {
  const [comprobando, setComprobando] = useState(true);
  const api = useMemo(() => new RepositorioApi(), []);

  useEffect(() => {
    let activo = true;
    void validarSesionDoctor()
      .then((doctor) => {
        if (activo && doctor) window.location.replace("/html/inicio.html");
      })
      .finally(() => {
        if (activo) setComprobando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  async function iniciarSesion(email, password) {
    await iniciarSesionDoctor(email, password);
    window.location.replace("/html/inicio.html");
  }

  if (comprobando) {
    return crearElemento("main", {
      className: "login-screen",
      children: crearElemento("p", { children: "Comprobando sesión…" }),
    });
  }

  return crearElemento(InicioSesion, {
    alIniciarSesion: iniciarSesion,
    alSolicitarCita: (solicitud) =>
      api.request("/cita/publica", "POST", solicitud),
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  crearElemento(React.StrictMode, { children: crearElemento(Acceso, {}) }),
);
