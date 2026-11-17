import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import SolicitarCita from "./solicitar-cita.js";
import { MarcaClinica } from "./marca.js";
export default function InicioSesion({ alIniciarSesion, alSolicitarCita }) {
  const [vista, setVista] = useState(() =>
    location.hash === "#solicitar-cita" ? "cita" : "acceso",
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  function abrirSolicitud() {
    setError("");
    setVista("cita");
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + "#solicitar-cita",
    );
  }
  function volverAcceso() {
    setVista("acceso");
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await alIniciarSesion(email, password);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo iniciar sesión.");
    } finally {
      setBusy(false);
    }
  }
  return _jsxs("main", {
    className: "login-screen" + (vista === "cita" ? " solicitud-activa" : ""),
    children: [
      _jsxs("section", {
        className: "login-art",
        "aria-label": "Cl\u00EDnica Familiar Wilson",
        children: [
          _jsxs("a", {
            className: "login-brand",
            href: "/html/inicio-sesion.html",
            "aria-label": "Clínica Familiar Wilson, ir al inicio",
            children: _jsx(MarcaClinica, {
              className: "brand-mark marca-acceso",
            }),
          }),
          _jsxs("article", {
            className: "login-message",
            children: [
              _jsx("span", {
                className: "login-kicker",
                children: "CL\u00CDNICA FAMILIAR",
              }),
              _jsx("h1", { children: "Un cuidado cercano, en cada paso." }),
              _jsx("p", {
                children:
                  "Organiza la atenci\u00F3n de tu cl\u00EDnica desde un espacio sencillo y seguro.",
              }),
            ],
          }),
          _jsxs("p", {
            className: "login-art-footer",
            children: [
              _jsx(ShieldCheck, { size: 17 }),
              " Acceso exclusivo para doctores",
            ],
          }),
        ],
      }),
      _jsxs("section", {
        className: "login-panel",
        "aria-labelledby":
          vista === "cita" ? "solicitar-titulo" : "login-title",
        children: [
          vista === "cita"
            ? _jsx(SolicitarCita, {
                alSolicitar: alSolicitarCita,
                alVolver: volverAcceso,
              })
            : _jsxs("article", {
            className: "login-card",
            children: [
              _jsx("p", {
                className: "eyebrow",
                children: "PORTAL M\u00C9DICO",
              }),
              _jsx("h2", { id: "login-title", children: "Inicia sesi\u00F3n" }),
              _jsx("p", {
                className: "login-subtitle",
                children: "Usa el correo registrado en tu perfil de doctor.",
              }),
              _jsxs("form", {
                onSubmit: submit,
                children: [
                  _jsxs("label", {
                    className: "login-field",
                    htmlFor: "login-email",
                    children: [
                      _jsx("span", { children: "Correo del doctor" }),
                      _jsxs("span", {
                        className: "login-input",
                        children: [
                          _jsx(Mail, { size: 17 }),
                          _jsx("input", {
                            id: "login-email",
                            type: "email",
                            autoComplete: "username",
                            placeholder: "doctor@clinica.com",
                            value: email,
                            onChange: (e) => {
                              setEmail(e.target.value);
                              setError("");
                            },
                            required: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  _jsxs("label", {
                    className: "login-field",
                    htmlFor: "login-password",
                    children: [
                      _jsx("span", { children: "Contrase\u00F1a" }),
                      _jsxs("span", {
                        className: "login-input",
                        children: [
                          _jsx(LockKeyhole, { size: 17 }),
                          _jsx("input", {
                            id: "login-password",
                            type: "password",
                            autoComplete: "current-password",
                            placeholder: "Contrase\u00F1a",
                            value: password,
                            onChange: (e) => {
                              setPassword(e.target.value);
                              setError("");
                            },
                            required: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                  error &&
                    _jsx("p", {
                      className: "login-error",
                      role: "alert",
                      children: error,
                    }),
                  _jsx("button", {
                    type: "submit",
                    className: "btn primary login-submit",
                    disabled: busy,
                    children: busy
                      ? "Verificando…"
                      : _jsxs(_Fragment, {
                          children: [
                            "Iniciar sesi\u00F3n ",
                            _jsx(ArrowRight, { size: 17 }),
                          ],
                        }),
                  }),
                ],
              }),
              _jsxs("div", {
                className: "login-divider",
                children: [_jsx("span", { children: "o" })],
              }),
              _jsxs("button", {
                type: "button",
                className: "appointment-open",
                onClick: abrirSolicitud,
                children: ["Solicitar cita", _jsx(ArrowRight, { size: 17 })],
              }),
              _jsx("a", {
                className: "login-about-link",
                href: "/html/quienes-somos.html",
                children: "Conoce quiénes somos",
              }),
            ],
          }),
          _jsxs("footer", {
            className: "login-footer",
            children: [
              _jsx(MarcaClinica, { className: "marca-pequena" }),
              "\u00A9 ",
              new Date().getFullYear(),
              " Wilson \u00B7 Cl\u00EDnica Familiar · Atención cercana para cada familia.",
            ],
          }),
        ],
      }),
    ],
  });
}
