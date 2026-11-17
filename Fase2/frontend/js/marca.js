import { jsx as _jsx } from "react/jsx-runtime";
import imagenLogo from "../imagenes/logo-wilson.png";

export function MarcaClinica({ className = "" }) {
  return _jsx("span", {
    className: ("logo-recorte " + className).trim(),
    "aria-hidden": "true",
    children: _jsx("img", {
      className: "logo-recorte-imagen",
      src: imagenLogo,
      alt: "",
    }),
  });
}
