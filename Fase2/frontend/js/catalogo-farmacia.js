import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Eye, Package, Pencil, Pill, Trash2 } from "lucide-react";
import { formatearMoneda } from "./modelo.js";
import "../css/farmacia.css";

function esInsumo(nombre) {
  return /gasa|guante|mascarilla|venda|jeringa|alcohol en gel/i.test(nombre);
}

function Resumen({ titulo, cantidad, icono, tono }) {
  const Icono = icono;
  return _jsxs("article", {
    className: "farmacia-resumen-card",
    children: [
      _jsx("span", {
        className: "farmacia-resumen-icono " + tono,
        children: _jsx(Icono, { size: 19, strokeWidth: 1.8 }),
      }),
      _jsx("small", { children: titulo }),
      _jsx("strong", { children: cantidad }),
    ],
  });
}

export default function CatalogoFarmacia({
  productos,
  mostrados,
  alVer,
  alEditar,
  alEliminar,
}) {
  const activos = productos.filter((producto) => producto.estadoProducto).length;
  const insumos = productos.filter((producto) =>
    esInsumo(producto.nombreProducto),
  ).length;
  const medicamentos = productos.length - insumos;

  return _jsxs("section", {
    className: "farmacia-catalogo",
    children: [
      _jsxs("section", {
        className: "farmacia-resumen",
        "aria-label": "Resumen del catálogo",
        children: [
          _jsx(Resumen, {
            titulo: "Productos activos",
            cantidad: activos,
            icono: Package,
            tono: "verde",
          }),
          _jsx(Resumen, {
            titulo: "Medicamentos",
            cantidad: medicamentos,
            icono: Pill,
            tono: "lavanda",
          }),
          _jsx(Resumen, {
            titulo: "Insumos clínicos",
            cantidad: insumos,
            icono: Package,
            tono: "durazno",
          }),
        ],
      }),
      _jsx("section", {
        className: "farmacia-productos",
        "aria-label": "Productos de farmacia",
        children: mostrados.map((producto) => {
          const insumo = esInsumo(producto.nombreProducto);
          return _jsxs(
            "article",
            {
              className: "farmacia-producto-card",
              children: [
                _jsxs("header", {
                  className: "farmacia-producto-cabecera",
                  children: [
                    _jsx("span", {
                      className:
                        "farmacia-producto-icono " +
                        (insumo ? "insumo" : "medicamento"),
                      children: _jsx(insumo ? Package : Pill, {
                        size: 21,
                        strokeWidth: 1.7,
                      }),
                    }),
                    _jsx("span", {
                      className:
                        "farmacia-estado " +
                        (producto.estadoProducto ? "disponible" : "inactivo"),
                      children: producto.estadoProducto
                        ? "Activo"
                        : "Inactivo",
                    }),
                  ],
                }),
                _jsx("p", {
                  className: "farmacia-categoria",
                  children: insumo ? "Insumo clínico" : "Medicamento",
                }),
                _jsx("h3", { children: producto.nombreProducto }),
                _jsxs("section", {
                  className: "farmacia-precio",
                  children: [
                    _jsx("span", { children: "Precio" }),
                    _jsx("strong", {
                      children: formatearMoneda(producto.precioProducto),
                    }),
                  ],
                }),
                _jsxs("footer", {
                  className: "farmacia-acciones",
                  children: [
                    _jsx("button", {
                      type: "button",
                      className: "farmacia-accion",
                      "aria-label": "Ver " + producto.nombreProducto,
                      onClick: () => alVer(producto),
                      children: _jsx(Eye, { size: 16 }),
                    }),
                    _jsx("button", {
                      type: "button",
                      className: "farmacia-accion",
                      "aria-label": "Editar " + producto.nombreProducto,
                      onClick: () => alEditar(producto),
                      children: _jsx(Pencil, { size: 16 }),
                    }),
                    _jsx("button", {
                      type: "button",
                      className: "farmacia-accion eliminar",
                      "aria-label": "Eliminar " + producto.nombreProducto,
                      onClick: () => alEliminar(producto),
                      children: _jsx(Trash2, { size: 16 }),
                    }),
                  ],
                }),
              ],
            },
            producto.idProducto,
          );
        }),
      }),
    ],
  });
}
