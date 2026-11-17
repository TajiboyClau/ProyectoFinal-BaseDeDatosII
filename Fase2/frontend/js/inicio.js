import {
  jsx as _jsx,
  jsxs as _jsxs,
  Fragment as _Fragment,
} from "react/jsx-runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  FileText,
  FolderHeart,
  Heart,
  LayoutDashboard,
  List,
  LoaderCircle,
  Menu,
  Pencil,
  Pill,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Trash2,
  Users,
  Wallet,
  X,
  Box,
  DoorOpen,
  AlertCircle,
  RefreshCw,
  Database as DatabaseIcon,
} from "lucide-react";
import {
  buscarModulo,
  mostrarDato,
  fechaLocal,
  modulos,
  formatearMoneda,
  nombreRegistro,
  claveRegistro,
} from "./modelo.js";
import {
  RepositorioApi,
  exportarCsv,
  valoresFormulario,
  prepararDatos,
} from "./datos.js";
import { cerrarSesionDoctor, validarSesionDoctor } from "./autenticacion.js";
import CatalogoFarmacia from "./catalogo-farmacia.js";
import { MarcaClinica } from "./marca.js";
import "../css/estilos.css";
import "../css/identidad.css";
const icons = {
  users: Users,
  calendar: CalendarDays,
  folder: FolderHeart,
  stethoscope: Stethoscope,
  clipboard: ClipboardList,
  file: FileText,
  list: List,
  heart: Heart,
  pill: Pill,
  box: Box,
  bag: ShoppingBag,
  wallet: Wallet,
  spark: Sparkles,
  door: DoorOpen,
  card: CreditCard,
};
function Icon({ name, size = 19 }) {
  const Component = icons[name] ?? Activity;
  return _jsx(Component, { size: size, strokeWidth: 1.7 });
}
const emptyDB = () => Object.fromEntries(modulos.map((m) => [m.id, []]));
const soloDigitos = (valor, maximo) => String(valor ?? '').replace(/\D/g, '').slice(0, maximo);
const fechaGuatemala = (fecha = new Date()) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Guatemala' }).format(fecha);
function dpiVisible(valor) {
  const digitos = soloDigitos(valor, 13);
  return [digitos.slice(0, 4), digitos.slice(4, 9), digitos.slice(9, 13)]
    .filter(Boolean)
    .join('-');
}
const paginaPorModulo = {
  inicio: "inicio",
  cita: "citas",
  paciente: "atencion",
  "historial-clinico": "atencion",
  consulta: "atencion",
  diagnostico: "atencion",
  receta: "atencion",
  "detalle-receta": "atencion",
  doctor: "equipo",
  enfermero: "equipo",
  producto: "farmacia",
  "movimiento-inventario": "farmacia",
  venta: "ventas",
  "detalle-venta": "ventas",
  pagos: "pagos",
  especialidad: "catalogos",
  consultorio: "catalogos",
  "tipo-pago": "catalogos",
};
const getRoute = () => {
  const fragmento = location.hash.replace("#/", "");
  const moduloSolicitado = new URLSearchParams(location.search).get("modulo");
  const moduloInicial = document.getElementById("root")?.dataset.modulo;
  const id = fragmento || moduloSolicitado || moduloInicial || "inicio";
  return modulos.some((m) => m.id === id) ? id : "inicio";
};
function Badge({ value }) {
  const str =
    value === true
      ? "Activo"
      : value === false
        ? "Inactivo"
        : String(value ?? "Sin estado");
  const cls = [
    "Atendida",
    "Pagado",
    "Completada",
    "Activo",
    "Entrada",
  ].includes(str)
    ? "green"
    : ["Cancelada", "Anulada", "Anulado", "Inactivo", "Salida"].includes(str)
      ? "gray"
      : "purple";
  return _jsxs("span", {
    className: "badge " + cls,
    children: [_jsx("span", {}), str],
  });
}
function Modal({
  title,
  subtitle,
  children,
  onClose,
  wide = false,
  busy = false,
}) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.showModal();
    return () => ref.current?.close();
  }, []);
  return _jsxs("dialog", {
    className: "modal " + (wide ? "wide" : ""),
    ref: ref,
    "aria-labelledby": "modal-title",
    onCancel: (e) => {
      e.preventDefault();
      if (!busy) onClose();
    },
    children: [
      _jsxs("header", {
        className: "modal-heading",
        children: [
          _jsxs("section", {
            children: [
              _jsx("h2", { id: "modal-title", children: title }),
              subtitle && _jsx("p", { children: subtitle }),
            ],
          }),
          _jsx("button", {
            type: "button",
            className: "icon-btn",
            "aria-label": "Cerrar ventana",
            onClick: onClose,
            disabled: busy,
            children: _jsx(X, { size: 20 }),
          }),
        ],
      }),
      children,
    ],
  });
}
function FormDialog({ module: m, row, db, onClose, onSave }) {
  const [values, setValues] = useState(() => valoresFormulario(m, row));
  const [referenceQueries, setReferenceQueries] = useState({});
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await onSave(m, prepararDatos(m, values, row), row);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setBusy(false);
    }
  }
  function input(f) {
    const disabled = busy || Boolean(row && m.keys.includes(f.key));
    const esDpiPaciente = m.id === 'paciente' && f.key === 'pacienteDpi';
    const esTelefono =
      (m.id === 'paciente' && f.key === 'pacienteTelefono') ||
      (m.id === 'doctor' && f.key === 'telefono');
    const esCorreoDoctor = m.id === 'doctor' && f.key === 'correo';
    const correoLocal = String(values[f.key] ?? '').replace(/@clinica\.com$/i, '').split('@')[0];
    const props = {
      id: "field-" + f.key,
      name: f.key,
      value: esDpiPaciente
        ? dpiVisible(values[f.key])
        : esCorreoDoctor
          ? correoLocal
          : values[f.key],
      required: f.required,
      disabled,
      onChange: (e) => {
        const value = esDpiPaciente
          ? soloDigitos(e.target.value, 13)
          : esTelefono
            ? soloDigitos(e.target.value, 8)
            : esCorreoDoctor
              ? (e.target.value.trim() ? `${e.target.value.trim().split('@')[0]}@clinica.com` : '')
            : e.target.value;
        setValues((v) => ({ ...v, [f.key]: value }));
      },
    };
    if (f.kind === "reference") {
      const target = buscarModulo(f.reference),
        records = db[target.id] ?? [],
        search = (referenceQueries[f.key] ?? '').trim().toLocaleLowerCase(),
        visibleRecords = search
          ? records.filter((registro) =>
              nombreRegistro(target, registro, db)
                .toLocaleLowerCase()
                .includes(search),
            )
          : records;
      const exists = records.some(
        (r) => String(r[target.keys[0]]) === values[f.key],
      );
      return _jsxs(_Fragment, {
        children: [
          _jsx('input', {
            className: 'reference-search',
            type: 'search',
            value: referenceQueries[f.key] ?? '',
            placeholder: `Buscar ${target.singular} por nombre…`,
            'aria-label': `Buscar ${target.singular} por nombre`,
            onChange: (e) =>
              setReferenceQueries((actual) => ({ ...actual, [f.key]: e.target.value })),
          }),
          _jsxs("select", {
            ...props,
            children: [
              _jsx("option", {
                value: "",
                children: f.required ? "Selecciona una opción" : "Sin asignar",
              }),
              values[f.key] &&
                !exists &&
                _jsxs("option", {
                  value: values[f.key],
                  children: ["Registro #", values[f.key], " (no disponible)"],
                }),
              visibleRecords.map((r) =>
                _jsx(
                  "option",
                  {
                    value: String(r[target.keys[0]]),
                    children: nombreRegistro(target, r, db),
                  },
                  claveRegistro(target, r),
                ),
              ),
            ],
          }),
          !records.length &&
            _jsxs("small", {
              children: [
                "Primero registra datos en ",
                target.title.toLowerCase(),
                ".",
              ],
            }),
        ],
      });
    }
    if (f.kind === "boolean")
      return _jsxs("select", {
        ...props,
        children: [
          _jsx("option", { value: "true", children: "Activo" }),
          _jsx("option", { value: "false", children: "Inactivo" }),
        ],
      });
    if (f.kind === "select")
      return _jsxs("select", {
        ...props,
        children: [
          _jsx("option", { value: "", children: "Sin especificar" }),
          values[f.key] &&
            !f.options?.includes(values[f.key]) &&
            _jsx("option", { children: values[f.key] }),
          f.options?.map((o) => _jsx("option", { children: o }, o)),
        ],
      });
    if (f.kind === "textarea")
      return _jsx("textarea", { ...props, maxLength: f.maxLength, rows: 3 });
    const control = _jsx("input", {
      ...props,
      type:
        f.kind === "number"
          ? "number"
          : f.kind === "timestamp"
            ? "datetime-local"
            : f.kind === "date"
              ? "date"
          : f.kind === "time"
                ? "text"
                : "text",
      maxLength: f.kind === "time" ? 5 : esDpiPaciente ? 15 : esTelefono ? 8 : esCorreoDoctor ? 100 : f.maxLength,
      inputMode: esDpiPaciente || esTelefono ? 'numeric' : undefined,
      placeholder: f.kind === 'time' ? 'HH:MM (ejemplo: 09:30)' : esDpiPaciente ? '0000-00000-0000' : esTelefono ? '12345678' : esCorreoDoctor ? 'nombre' : undefined,
      min: f.min,
      max: f.kind === "number" ? 99999999.99 : undefined,
      step:
        f.kind === "number" ? "0.01" : f.kind === "timestamp" ? 1 : undefined,
    });
    return esTelefono
      ? _jsxs('span', {
          className: 'form-telefono',
          children: [
            _jsx('span', { className: 'telefono-prefijo', children: '+502' }),
            control,
          ],
        })
      : esCorreoDoctor
        ? _jsxs('span', {
            className: 'form-correo',
            children: [control, _jsx('span', { className: 'correo-sufijo', children: '@clinica.com' })],
          })
      : control;
  }
  return _jsx(Modal, {
    title: (row ? "Editar " : "Registrar ") + m.singular,
    subtitle: "Los cambios se guardar\u00E1n en la base de la cl\u00EDnica.",
    onClose: onClose,
    wide: true,
    busy: busy,
    children: _jsxs("form", {
      onSubmit: submit,
      children: [
        _jsx("section", {
          className: "form-grid",
          children: m.fields.map((f) =>
            _jsxs(
              "label",
              {
                className:
                  "form-field " + (f.kind === "textarea" ? "full" : ""),
                htmlFor: "field-" + f.key,
                children: [
                  _jsxs("span", {
                    children: [
                      f.label,
                      f.required &&
                        _jsx("b", { className: "required", children: " *" }),
                    ],
                  }),
                  input(f),
                ],
              },
              f.key,
            ),
          ),
        }),
        _jsxs("p", {
          className: "form-note",
          children: [
            "* Campos obligatorios",
            row && m.keys.length > 1
              ? " · Los identificadores del detalle no se pueden cambiar."
              : "",
          ],
        }),
        error &&
          _jsxs("aside", {
            className: "error-box",
            role: "alert",
            children: [_jsx(AlertCircle, { size: 18 }), error],
          }),
        _jsxs("footer", {
          className: "modal-footer",
          children: [
            _jsx("button", {
              type: "button",
              className: "btn secondary",
              onClick: onClose,
              disabled: busy,
              children: "Cancelar",
            }),
            _jsxs("button", {
              className: "btn primary",
              disabled: busy,
              children: [
                busy
                  ? _jsx(LoaderCircle, { size: 17, className: "spin" })
                  : _jsx(Check, { size: 17 }),
                "Guardar ",
                row ? "cambios" : "registro",
              ],
            }),
          ],
        }),
      ],
    }),
  });
}
function RecordDialog({ m, row, db, onClose }) {
  return _jsxs(Modal, {
    title: nombreRegistro(m, row, db),
    subtitle: m.title + " · #" + claveRegistro(m, row),
    onClose: onClose,
    wide: true,
    children: [
      _jsx("dl", {
        className: "detail-grid",
        children: m.fields.map((f) =>
          _jsxs(
            "section",
            {
              children: [
                _jsx("dt", { children: f.label }),
                _jsx("dd", { children: mostrarDato(m, row, f.key, db) }),
              ],
            },
            f.key,
          ),
        ),
      }),
      _jsx("footer", {
        className: "modal-footer",
        children: _jsx("button", {
          className: "btn secondary",
          onClick: onClose,
          children: "Cerrar",
        }),
      }),
    ],
  });
}
function DeleteDialog({ m, row, db, onClose, onDelete }) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  return _jsxs(Modal, {
    title: "Eliminar registro",
    onClose: onClose,
    busy: busy,
    children: [
      _jsxs("article", {
        className: "delete-copy",
        children: [
          _jsx("span", {
            className: "delete-icon",
            children: _jsx(Trash2, { size: 25 }),
          }),
          _jsxs("p", {
            children: [
              "Vas a eliminar ",
              _jsx("strong", { children: nombreRegistro(m, row, db) }),
              ".",
            ],
          }),
          _jsx("p", {
            children:
              "Si tiene registros relacionados, la eliminaci\u00F3n ser\u00E1 rechazada.",
          }),
        ],
      }),
      error &&
        _jsx("aside", {
          className: "error-box",
          role: "alert",
          children: error,
        }),
      _jsxs("footer", {
        className: "modal-footer",
        children: [
          _jsx("button", {
            className: "btn secondary",
            onClick: onClose,
            disabled: busy,
            children: "Cancelar",
          }),
          _jsx("button", {
            className: "btn danger",
            disabled: busy,
            onClick: async () => {
              setBusy(true);
              try {
                await onDelete(m, row);
              } catch (e) {
                setError(
                  e instanceof Error ? e.message : "No se pudo eliminar.",
                );
              } finally {
                setBusy(false);
              }
            },
            children: busy ? "Eliminando…" : "Eliminar registro",
          }),
        ],
      }),
    ],
  });
}
export default function Inicio() {
  const [route, setRoute] = useState(getRoute),
    [mobile, setMobile] = useState(false);
  const [doctor, setDoctor] = useState(null),
    [authLoading, setAuthLoading] = useState(true);
  const [db, setDb] = useState(emptyDB),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState("");
  const [dialog, setDialog] = useState(null),
    [toast, setToast] = useState(""),
    [query, setQuery] = useState(""),
    [statusFilter, setStatusFilter] = useState(
      () =>
        new URLSearchParams(location.search).get("estado") ||
        document.getElementById("root")?.dataset.estado ||
        "",
    ),
    [page, setPage] = useState(1),
    [sort, setSort] = useState({ key: "", reverse: false });
  const [globalSearch, setGlobalSearch] = useState(""),
    [day, setDay] = useState(fechaLocal);
  const api = useMemo(() => new RepositorioApi(), []);
  const source = api;
  const requestVersion = useRef(0);
  const refresh = useCallback(async () => {
    const version = ++requestVersion.current;
    setLoading(true);
    setLoadError("");
    try {
      const result = await source.load();
      if (version === requestVersion.current) setDb(result);
    } catch (e) {
      if (version === requestVersion.current) {
        setDb(emptyDB());
        setLoadError(
          e instanceof Error ? e.message : "No se pudieron cargar los datos.",
        );
      }
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  }, [source]);
  useEffect(() => {
    let active = true;
    void validarSesionDoctor()
      .then((profile) => {
        if (active) setDoctor(profile);
      })
      .finally(() => {
        if (active) setAuthLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!authLoading && !doctor) {
      window.location.replace("/html/inicio-sesion.html");
    }
  }, [authLoading, doctor]);
  useEffect(() => {
    if (!doctor) {
      setDb(emptyDB());
      setLoading(false);
      return;
    }
    setDb(emptyDB());
    void refresh();
    return () => {
      requestVersion.current++;
    };
  }, [refresh, doctor]);
  useEffect(() => {
    const listener = () => {
      setRoute(getRoute());
      setQuery("");
      setStatusFilter("");
      setPage(1);
      setSort({ key: "", reverse: false });
      setMobile(false);
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 4500);
    return () => clearTimeout(id);
  }, [toast]);
  function navigate(id) {
    const pagina = paginaPorModulo[id] ?? "inicio";
    const rutaDestino = "/html/" + pagina + ".html";
    if (location.pathname !== rutaDestino) {
      const modulo = id === pagina ? "" : "?modulo=" + encodeURIComponent(id);
      window.location.assign(rutaDestino + modulo);
      return;
    }
    location.hash = "/" + id;
    setGlobalSearch("");
    setMobile(false);
  }
  async function save(m, data, row) {
    if (row) await source.update(m, row, data);
    else await source.create(m, data);
    setDialog(null);
    setToast("Registro guardado correctamente");
    await refresh();
  }
  async function remove(m, row) {
    await source.remove(m, row);
    setDialog(null);
    setToast("Registro eliminado");
    await refresh();
  }
  async function logout() {
    await cerrarSesionDoctor();
    window.location.replace("/html/inicio-sesion.html");
  }
  const current = route === "inicio" ? null : buscarModulo(route);
  const esPaginaSolicitudes = location.pathname.endsWith("/solicitudes.html");
  const currentTitle = esPaginaSolicitudes
    ? "Solicitudes de cita"
    : (current?.title ?? "Resumen");
  const currentDescription = esPaginaSolicitudes
    ? "Revisa las solicitudes pendientes y confirma el horario y profesional."
    : current?.description;
  const currentRows = current ? (db[current.id] ?? []) : [];
  const filtered = current
    ? currentRows
        .filter(
          (r) =>
            (!statusFilter || String(r[current.status]) === statusFilter) &&
            [...current.keys, ...current.fields.map((f) => f.key)].some((k) =>
              mostrarDato(current, r, k, db)
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase()),
            ),
        )
        .sort((a, b) =>
          sort.key
            ? mostrarDato(current, a, sort.key, db).localeCompare(
                mostrarDato(current, b, sort.key, db),
                "es",
                { numeric: true },
              ) * (sort.reverse ? -1 : 1)
            : 0,
        )
    : [];
  const pages = Math.max(1, Math.ceil(filtered.length / 8)),
    safePage = Math.min(page, pages);
  const shown = filtered.slice((safePage - 1) * 8, safePage * 8);
  const dayCitas = (db.cita ?? [])
    .filter((r) => r.fechaCita === day)
    .sort((a, b) => String(a.horaCita).localeCompare(String(b.horaCita)));
  const selectedDate = new Date(day + "T12:00:00");
  const monday = new Date(selectedDate);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
  const today = fechaGuatemala();
  const appointmentsToday = (db.cita ?? []).filter(
    (r) => r.fechaCita === today,
  );
  const income = (db.pagos ?? [])
    .filter(
      (r) =>
        r.estadoPago === "Pagado" &&
        r.fechaPago &&
        fechaGuatemala(new Date(String(r.fechaPago))) === today,
    )
    .reduce((sum, r) => sum + Number(r.montoPago ?? 0), 0);
  const globalResults = globalSearch.trim()
    ? modulos.filter((m) =>
        m.title.toLocaleLowerCase().includes(globalSearch.toLocaleLowerCase()),
      )
    : [];
  const patientResults = globalSearch.trim()
    ? (db.paciente ?? [])
        .filter((r) =>
          nombreRegistro(buscarModulo("paciente"), r, db)
            .toLocaleLowerCase()
            .includes(globalSearch.toLocaleLowerCase()),
        )
        .slice(0, 4)
    : [];
  function exportRows() {
    if (!current) return;
    const url = URL.createObjectURL(
      new Blob([exportarCsv(current, filtered, db, mostrarDato)], {
        type: "text/csv;charset=utf-8;",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = current.id + "-" + fechaLocal() + ".csv";
    a.click();
    URL.revokeObjectURL(url);
    setToast("Listado exportado en CSV");
  }
  const canAct = !loading && !loadError;
  if (authLoading || !doctor)
    return _jsx("main", {
      className: "app-loading",
      children: _jsx("section", {
        className: "login-panel",
        children: _jsx("p", { children: "Comprobando sesi\u00F3n\u2026" }),
      }),
    });
  return _jsxs("main", {
    className: "app",
    children: [
      _jsx("a", {
        href: "#contenido",
        className: "skip-link",
        children: "Saltar al contenido",
      }),
      mobile &&
        _jsx("button", {
          className: "sidebar-scrim",
          "aria-label": "Cerrar men\u00FA",
          onClick: () => setMobile(false),
        }),
      _jsxs("aside", {
        className: "sidebar " + (mobile ? "open" : ""),
        children: [
          _jsxs("button", {
            className: "brand",
            onClick: () => navigate("inicio"),
            "aria-label": "Wilson, ir al inicio",
            children: [
              _jsx(MarcaClinica, { className: "brand-mark marca-portada" }),
              _jsxs("span", {
                children: [
                  _jsxs("strong", {
                    children: [
                      "wilson",
                      _jsx("span", { className: "brand-dot", children: "." }),
                    ],
                  }),
                  _jsx("small", { children: "CL\u00CDNICA FAMILIAR" }),
                ],
              }),
            ],
          }),
          _jsxs("section", {
            className: "workspace",
            children: [
              _jsx(MarcaClinica, {
                className: "workspace-logo marca-pequena",
              }),
              _jsxs("p", {
                children: [
                  "Gesti\u00F3n de la cl\u00EDnica",
                  _jsx("small", { children: "Espacio de trabajo" }),
                ],
              }),
              _jsx("span", { className: "workspace-dot" }),
            ],
          }),
          _jsxs("nav", {
            "aria-label": "Navegaci\u00F3n principal",
            children: [
              _jsxs("button", {
                className: "nav-link " + (route === "inicio" ? "active" : ""),
                onClick: () => navigate("inicio"),
                children: [
                  _jsx(LayoutDashboard, { size: 19 }),
                  "Resumen",
                  _jsx("span", { className: "nav-dot" }),
                ],
              }),
              _jsxs("button", {
                className: "nav-link " + (esPaginaSolicitudes ? "active" : ""),
                onClick: () => window.location.assign("/html/solicitudes.html"),
                children: [
                  _jsx(CalendarDays, { size: 19 }),
                  _jsx("span", { children: "Solicitudes de cita" }),
                  _jsx("small", {
                    className: "nav-count",
                    children: (db.cita ?? []).filter(
                      (cita) => cita.estadoCita === "Solicitada",
                    ).length,
                  }),
                ],
              }),
              [
                "Atención clínica",
                "Equipo",
                "Farmacia y pagos",
                "Catálogos",
              ].map((group) =>
                _jsxs(
                  "section",
                  {
                    className: "nav-group",
                    children: [
                      _jsx("h2", { children: group }),
                      modulos
                        .filter((m) => m.group === group)
                        .map((m) =>
                          _jsxs(
                            "button",
                            {
                              className:
                                "nav-link " + (route === m.id ? "active" : ""),
                              onClick: () => navigate(m.id),
                              children: [
                                _jsx(Icon, { name: m.icon }),
                                _jsx("span", { children: m.title }),
                                m.id === "cita" &&
                                  _jsx("small", {
                                    className: "nav-count",
                                    children: appointmentsToday.length,
                                  }),
                              ],
                            },
                            m.id,
                          ),
                        ),
                    ],
                  },
                  group,
                ),
              ),
            ],
          }),
          _jsxs("section", {
            className: "sidebar-bottom",
            children: [
              _jsx("span", {
                className: "mode-icon",
                children: _jsx(DatabaseIcon, { size: 19 }),
              }),
              _jsxs("span", {
                children: [
                  doctor.doctorNombre,
                  " ",
                  doctor.doctorApellido,
                  _jsx("small", { className: "doctor-verificado", children: "Cuenta de doctor verificada" }),
                ],
              }),
            ],
          }),
        ],
      }),
      _jsxs("section", {
        className: "main-shell",
        children: [
          _jsxs("header", {
            className: "topbar",
            children: [
              _jsxs("nav", {
                className: "breadcrumb",
                "aria-label": "Ubicaci\u00F3n",
                children: [
                  _jsx("button", {
                    className: "icon-btn mobile-menu",
                    onClick: () => setMobile(true),
                    "aria-label": "Abrir men\u00FA",
                    children: _jsx(Menu, { size: 21 }),
                  }),
                  _jsx("span", { children: "Mi cl\u00EDnica" }),
                  _jsx(ChevronRight, { size: 14 }),
                  _jsx("strong", { children: currentTitle }),
                ],
              }),
              _jsxs("nav", {
                className: "header-actions",
                "aria-label": "Cuenta y b\u00FAsqueda",
                children: [
                  _jsxs("section", {
                    className: "global-search",
                    children: [
                      _jsx(Search, { size: 17 }),
                      _jsx("input", {
                        "aria-label": "Buscar m\u00F3dulos o pacientes",
                        placeholder: "Buscar en la cl\u00EDnica\u2026",
                        value: globalSearch,
                        onChange: (e) => setGlobalSearch(e.target.value),
                        onKeyDown: (e) => {
                          if (e.key === "Escape") setGlobalSearch("");
                        },
                      }),
                      globalSearch &&
                        _jsxs("section", {
                          className: "search-results",
                          children: [
                            globalResults.map((m) =>
                              _jsxs(
                                "button",
                                {
                                  onClick: () => navigate(m.id),
                                  children: [
                                    _jsx(Icon, { name: m.icon }),
                                    _jsxs("span", {
                                      children: [
                                        m.title,
                                        _jsx("small", {
                                          children: "M\u00F3dulo",
                                        }),
                                      ],
                                    }),
                                    _jsx(ArrowUpRight, { size: 16 }),
                                  ],
                                },
                                m.id,
                              ),
                            ),
                            patientResults.map((r) =>
                              _jsxs(
                                "button",
                                {
                                  onClick: () => {
                                    setDialog({
                                      kind: "view",
                                      module: buscarModulo("paciente"),
                                      row: r,
                                    });
                                    setGlobalSearch("");
                                  },
                                  children: [
                                    _jsx(Users, { size: 17 }),
                                    _jsxs("span", {
                                      children: [
                                        nombreRegistro(
                                          buscarModulo("paciente"),
                                          r,
                                          db,
                                        ),
                                        _jsx("small", { children: "Paciente" }),
                                      ],
                                    }),
                                  ],
                                },
                                String(r.idPaciente),
                              ),
                            ),
                            !globalResults.length &&
                              !patientResults.length &&
                              _jsx("p", {
                                children: "No encontramos coincidencias.",
                              }),
                          ],
                        }),
                    ],
                  }),
                  _jsx("span", { className: "header-divider" }),
                  _jsxs("span", {
                    className: "user-greeting",
                    children: ["Hola, ", doctor.doctorNombre],
                  }),
                  _jsx("span", {
                    className: "avatar admin",
                    "aria-label": "Sesión de " + doctor.doctorNombre,
                    children: doctor.doctorNombre.slice(0, 1).toUpperCase(),
                  }),
                  _jsx("button", {
                    className: "icon-btn",
                    "aria-label": "Cerrar sesi\u00F3n",
                    title: "Cerrar sesi\u00F3n",
                    onClick: () => void logout(),
                    children: _jsx(DoorOpen, { size: 18 }),
                  }),
                ],
              }),
            ],
          }),
          _jsxs("section", {
            id: "contenido",
            tabIndex: -1,
            children: [
              _jsxs("aside", {
                className: "mode-banner api",
                children: [
                  _jsx("span", { className: "banner-dot" }),
                  _jsxs("span", {
                    children: [
                      _jsx("strong", { children: "Conexi\u00F3n segura." }),
                      " Los datos se consultan en la base de la cl\u00EDnica.",
                    ],
                  }),
                ],
              }),
              loadError &&
                _jsxs("aside", {
                  className: "load-error",
                  role: "alert",
                  children: [
                    _jsx(AlertCircle, { size: 22 }),
                    _jsxs("section", {
                      children: [
                        _jsx("strong", {
                          children: "No pudimos cargar la informaci\u00F3n",
                        }),
                        _jsx("p", { children: loadError }),
                      ],
                    }),
                    _jsx("button", {
                      className: "btn secondary",
                      onClick: () => void refresh(),
                      children: "Reintentar",
                    }),
                  ],
                }),
              route === "inicio"
                ? _jsxs(_Fragment, {
                    children: [
                      _jsxs("header", {
                        className: "page-heading",
                        children: [
                          _jsxs("section", {
                            children: [
                              _jsx("p", {
                                className: "eyebrow",
                                children: "CL\u00CDNICA FAMILIAR WILSON",
                              }),
                              _jsxs("h1", {
                                children: [
                                  "Tu cl\u00EDnica, al d\u00EDa",
                                  _jsx("span", { children: "." }),
                                ],
                              }),
                              _jsx("p", {
                                children:
                                  "Todo lo que necesitas para acompa\u00F1ar a tus pacientes.",
                              }),
                            ],
                          }),
                          _jsxs("button", {
                            className: "btn primary",
                            disabled: !canAct,
                            onClick: () =>
                              setDialog({
                                kind: "form",
                                module: buscarModulo("cita"),
                              }),
                            children: [_jsx(Plus, { size: 18 }), "Nueva cita"],
                          }),
                        ],
                      }),
                      _jsx("section", {
                        className: "stats",
                        "aria-label": "Resumen de la cl\u00EDnica",
                        children: [
                          {
                            label: "Citas de hoy",
                            value: appointmentsToday.length,
                            note: "En la agenda de hoy",
                            icon: CalendarDays,
                            color: "lavender",
                          },
                          {
                            label: "Pacientes",
                            value: (db.paciente ?? []).length,
                            note: "Registrados en la clínica",
                            icon: Users,
                            color: "sage",
                          },
                          {
                            label: "Atenciones de hoy",
                            value: appointmentsToday.filter(
                              (r) => r.estadoCita === "Atendida",
                            ).length,
                            note: "Citas marcadas como atendidas",
                            icon: Heart,
                            color: "peach",
                          },
                          {
                            label: "Pagos de consultas",
                            value: formatearMoneda(income),
                            note: "Pagos registrados hoy",
                            icon: Wallet,
                            color: "butter",
                          },
                        ].map((card) =>
                          _jsxs(
                            "article",
                            {
                              className: "stat-card",
                              children: [
                                _jsxs("header", {
                                  children: [
                                    _jsx("span", { children: card.label }),
                                    _jsx("span", {
                                      className: "stat-icon " + card.color,
                                      children: _jsx(card.icon, { size: 20 }),
                                    }),
                                  ],
                                }),
                                _jsx("strong", {
                                  children: loading ? "—" : card.value,
                                }),
                                _jsx("small", { children: card.note }),
                              ],
                            },
                            card.label,
                          ),
                        ),
                      }),
                      _jsxs("section", {
                        className: "dashboard-grid",
                        children: [
                          _jsxs("section", {
                            className: "panel agenda",
                            children: [
                              _jsxs("header", {
                                className: "panel-heading",
                                children: [
                                  _jsxs("section", {
                                    children: [
                                      _jsxs("h2", {
                                        children: [
                                          "Agenda de atenci\u00F3n ",
                                          _jsx("span", {
                                            className: "count-tag",
                                            children: dayCitas.length,
                                          }),
                                        ],
                                      }),
                                      _jsx("p", {
                                        children:
                                          selectedDate.toLocaleDateString(
                                            "es-GT",
                                            {
                                              weekday: "long",
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            },
                                          ),
                                      }),
                                    ],
                                  }),
                                  _jsxs("nav", {
                                    className: "date-controls",
                                    "aria-label": "Cambiar semana",
                                    children: [
                                      _jsx("button", {
                                        className: "icon-btn",
                                        "aria-label": "Semana anterior",
                                        onClick: () => {
                                          const d = new Date(selectedDate);
                                          d.setDate(d.getDate() - 7);
                                          setDay(fechaLocal(d));
                                        },
                                        children: _jsx(ChevronLeft, {
                                          size: 18,
                                        }),
                                      }),
                                      _jsx("button", {
                                        className: "text-btn",
                                        onClick: () => setDay(today),
                                        children: "Hoy",
                                      }),
                                      _jsx("button", {
                                        className: "icon-btn",
                                        "aria-label": "Semana siguiente",
                                        onClick: () => {
                                          const d = new Date(selectedDate);
                                          d.setDate(d.getDate() + 7);
                                          setDay(fechaLocal(d));
                                        },
                                        children: _jsx(ChevronRight, {
                                          size: 18,
                                        }),
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              _jsx("nav", {
                                className: "week-strip",
                                "aria-label": "D\u00EDas de la semana",
                                children: week.map((d) => {
                                  const key = fechaLocal(d),
                                    has = (db.cita ?? []).some(
                                      (r) => r.fechaCita === key,
                                    );
                                  return _jsxs(
                                    "button",
                                    {
                                      "aria-label": d.toLocaleDateString(
                                        "es-GT",
                                        { dateStyle: "full" },
                                      ),
                                      "aria-pressed": key === day,
                                      className: key === day ? "selected" : "",
                                      onClick: () => setDay(key),
                                      children: [
                                        _jsx("span", {
                                          children: d
                                            .toLocaleDateString("es-GT", {
                                              weekday: "short",
                                            })
                                            .replace(".", ""),
                                        }),
                                        _jsx("strong", {
                                          children: d.getDate(),
                                        }),
                                        _jsx("i", {
                                          className: has
                                            ? "has-appointments"
                                            : "",
                                        }),
                                      ],
                                    },
                                    key,
                                  );
                                }),
                              }),
                              _jsxs("header", {
                                className: "agenda-labels",
                                children: [
                                  _jsx("span", { children: "HORA / PACIENTE" }),
                                  _jsx("span", { children: "ATENCI\u00D3N" }),
                                  _jsx("span", { children: "ESTADO" }),
                                ],
                              }),
                              loading
                                ? _jsxs("section", {
                                    className: "empty",
                                    children: [
                                      _jsx(LoaderCircle, { className: "spin" }),
                                      "Cargando agenda\u2026",
                                    ],
                                  })
                                : dayCitas.length
                                  ? dayCitas.map((c, i) =>
                                      _jsxs(
                                        "button",
                                        {
                                          className: "appointment",
                                          onClick: () =>
                                            setDialog({
                                              kind: "view",
                                              module: buscarModulo("cita"),
                                              row: c,
                                            }),
                                          children: [
                                            _jsxs("span", {
                                              className: "appointment-time",
                                              children: [
                                                String(c.horaCita ?? "").slice(
                                                  0,
                                                  5,
                                                ),
                                                _jsxs("small", {
                                                  children: [
                                                    "cita #",
                                                    String(c.idCita),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            _jsx("span", {
                                              className:
                                                "avatar color-" + (i % 4),
                                              children: mostrarDato(
                                                buscarModulo("cita"),
                                                c,
                                                "pacienteId",
                                                db,
                                              )
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((n) => n[0])
                                                .join(""),
                                            }),
                                            _jsxs("span", {
                                              className: "appointment-patient",
                                              children: [
                                                _jsx("strong", {
                                                  children: mostrarDato(
                                                    buscarModulo("cita"),
                                                    c,
                                                    "pacienteId",
                                                    db,
                                                  ),
                                                }),
                                                _jsx("small", {
                                                  children: String(
                                                    c.motivoCita ??
                                                      "Consulta médica",
                                                  ),
                                                }),
                                              ],
                                            }),
                                            _jsxs("span", {
                                              className: "appointment-doctor",
                                              children: [
                                                mostrarDato(
                                                  buscarModulo("cita"),
                                                  c,
                                                  "doctorId",
                                                  db,
                                                ),
                                                _jsx("small", {
                                                  children: mostrarDato(
                                                    buscarModulo("cita"),
                                                    c,
                                                    "consultorioId",
                                                    db,
                                                  ),
                                                }),
                                              ],
                                            }),
                                            _jsx(Badge, {
                                              value: c.estadoCita,
                                            }),
                                            _jsx(ChevronRight, {
                                              size: 16,
                                              className: "row-chevron",
                                            }),
                                          ],
                                        },
                                        String(c.idCita),
                                      ),
                                    )
                                  : _jsxs("section", {
                                      className: "empty",
                                      children: [
                                        _jsx(CalendarDays, { size: 31 }),
                                        _jsx("strong", {
                                          children:
                                            "No hay citas para este d\u00EDa",
                                        }),
                                        _jsx("span", {
                                          children:
                                            "Puedes registrar una nueva cita o elegir otra fecha.",
                                        }),
                                      ],
                                    }),
                              _jsxs("button", {
                                className: "panel-link",
                                onClick: () => navigate("cita"),
                                children: [
                                  "Ver todas las citas ",
                                  _jsx(ArrowRight, { size: 16 }),
                                ],
                              }),
                            ],
                          }),
                          _jsxs("section", {
                            className: "right-column",
                            children: [
                              _jsxs("article", {
                                className: "welcome-card",
                                children: [
                                  _jsx("span", {
                                    className: "welcome-symbol",
                                    children: _jsx(Heart, {
                                      size: 24,
                                      strokeWidth: 1.5,
                                    }),
                                  }),
                                  _jsx("span", {
                                    className: "eyebrow",
                                    children: "CERCA DE CADA PACIENTE",
                                  }),
                                  _jsxs("h2", {
                                    children: [
                                      "Una atenci\u00F3n m\u00E1s",
                                      _jsx("br", {}),
                                      "personal, cada d\u00EDa.",
                                    ],
                                  }),
                                  _jsx("p", {
                                    children:
                                      "Accede al historial y mant\u00E9n la continuidad de cada consulta.",
                                  }),
                                  _jsxs("button", {
                                    onClick: () =>
                                      navigate("historial-clinico"),
                                    children: [
                                      "Ver historiales ",
                                      _jsx(ArrowUpRight, { size: 19 }),
                                    ],
                                  }),
                                  _jsx("span", {
                                    className: "welcome-decoration",
                                    "aria-hidden": "true",
                                    children: "+",
                                  }),
                                ],
                              }),
                              _jsxs("section", {
                                className: "panel team",
                                children: [
                                  _jsxs("header", {
                                    className: "panel-heading",
                                    children: [
                                      _jsxs("section", {
                                        children: [
                                          _jsx("h2", {
                                            children: "Equipo m\u00E9dico",
                                          }),
                                          _jsx("p", {
                                            children: "Doctores registrados",
                                          }),
                                        ],
                                      }),
                                      _jsx(Stethoscope, { size: 20 }),
                                    ],
                                  }),
                                  (db.doctor ?? []).slice(0, 3).map((d, i) =>
                                    _jsxs(
                                      "button",
                                      {
                                        className: "team-row",
                                        onClick: () =>
                                          setDialog({
                                            kind: "view",
                                            module: buscarModulo("doctor"),
                                            row: d,
                                          }),
                                        children: [
                                          _jsxs("span", {
                                            className: "avatar color-" + i,
                                            children: [
                                              String(d.doctorNombre ?? "")[0],
                                              String(d.doctorApellido ?? "")[0],
                                            ],
                                          }),
                                          _jsxs("span", {
                                            children: [
                                              _jsx("strong", {
                                                children: nombreRegistro(
                                                  buscarModulo("doctor"),
                                                  d,
                                                  db,
                                                ),
                                              }),
                                              _jsx("small", {
                                                children: mostrarDato(
                                                  buscarModulo("doctor"),
                                                  d,
                                                  "doctorEspecialidad",
                                                  db,
                                                ),
                                              }),
                                            ],
                                          }),
                                          _jsx(ChevronRight, { size: 16 }),
                                        ],
                                      },
                                      String(d.doctorId),
                                    ),
                                  ),
                                  !loading &&
                                    !db.doctor?.length &&
                                    _jsx("p", {
                                      className: "empty",
                                      children: "No hay doctores registrados.",
                                    }),
                                  _jsxs("button", {
                                    className: "panel-link",
                                    onClick: () => navigate("doctor"),
                                    children: [
                                      "Administrar equipo ",
                                      _jsx(ArrowRight, { size: 16 }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      _jsxs("section", {
                        className: "quick-actions",
                        children: [
                          _jsxs("article", {
                            children: [
                              _jsx("span", {
                                className: "quick-icon",
                                children: _jsx(Users, { size: 21 }),
                              }),
                              _jsxs("span", {
                                children: [
                                  _jsx("strong", {
                                    children: "Un nuevo paciente",
                                  }),
                                  _jsx("small", {
                                    children:
                                      "Registra sus datos para empezar.",
                                  }),
                                ],
                              }),
                              _jsx("button", {
                                className: "icon-btn",
                                "aria-label": "Registrar paciente",
                                disabled: !canAct,
                                onClick: () =>
                                  setDialog({
                                    kind: "form",
                                    module: buscarModulo("paciente"),
                                  }),
                                children: _jsx(Plus, { size: 19 }),
                              }),
                            ],
                          }),
                          _jsxs("article", {
                            children: [
                              _jsx("span", {
                                className: "quick-icon lavender",
                                children: _jsx(Pill, { size: 21 }),
                              }),
                              _jsxs("span", {
                                children: [
                                  _jsx("strong", {
                                    children: "Farmacia de la cl\u00EDnica",
                                  }),
                                  _jsx("small", {
                                    children: "Productos, ventas e inventario.",
                                  }),
                                ],
                              }),
                              _jsx("button", {
                                className: "icon-btn",
                                "aria-label": "Ir a farmacia",
                                onClick: () => navigate("producto"),
                                children: _jsx(ArrowUpRight, { size: 19 }),
                              }),
                            ],
                          }),
                          _jsxs("article", {
                            children: [
                              _jsx("span", {
                                className: "quick-icon peach",
                                children: _jsx(Wallet, { size: 21 }),
                              }),
                              _jsxs("span", {
                                children: [
                                  _jsx("strong", {
                                    children: "Pagos de consultas",
                                  }),
                                  _jsx("small", {
                                    children: "Consulta y registra los cobros.",
                                  }),
                                ],
                              }),
                              _jsx("button", {
                                className: "icon-btn",
                                "aria-label": "Ir a pagos",
                                onClick: () => navigate("pagos"),
                                children: _jsx(ArrowUpRight, { size: 19 }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : current &&
                  _jsxs(_Fragment, {
                    children: [
                      _jsxs("header", {
                        className: "page-heading",
                        children: [
                          _jsxs("section", {
                            children: [
                              _jsx("p", {
                                className: "eyebrow",
                                children: current.group.toUpperCase(),
                              }),
                              _jsxs("h1", {
                                children: [
                                  currentTitle,
                                  _jsx("span", { children: "." }),
                                ],
                              }),
                              _jsx("p", { children: currentDescription }),
                            ],
                          }),
                          _jsxs("button", {
                            className: "btn primary",
                            disabled: !canAct,
                            onClick: () =>
                              setDialog({ kind: "form", module: current }),
                            children: [
                              _jsx(Plus, { size: 18 }),
                              "Registrar ",
                              current.singular,
                            ],
                          }),
                        ],
                      }),
                      _jsxs("section", {
                        className: "panel records",
                        children: [
                          _jsxs("header", {
                            className: "records-toolbar",
                            children: [
                              _jsxs("section", {
                                className: "section-title",
                                children: [
                                  _jsx("h2", {
                                    children: esPaginaSolicitudes
                                      ? "Solicitudes recibidas"
                                      : current.id === "producto"
                                        ? "Catálogo de medicamentos e insumos"
                                        : "Todos los registros",
                                  }),
                                  _jsx("span", {
                                    className: "count-tag",
                                    children: filtered.length,
                                  }),
                                ],
                              }),
                              _jsxs("button", {
                                className: "btn secondary compact",
                                onClick: exportRows,
                                disabled: !canAct || !filtered.length,
                                children: [
                                  _jsx(Download, { size: 16 }),
                                  "Exportar CSV",
                                ],
                              }),
                            ],
                          }),
                          _jsxs("form", {
                            className: "filters",
                            onSubmit: (e) => e.preventDefault(),
                            children: [
                              _jsxs("label", {
                                className: "table-search",
                                children: [
                                  _jsx(Search, { size: 18 }),
                                  _jsx("input", {
                                    value: query,
                                    onChange: (e) => {
                                      setQuery(e.target.value);
                                      setPage(1);
                                    },
                                    placeholder:
                                      "Buscar en " +
                                      currentTitle.toLowerCase() +
                                      "…",
                                    "aria-label": "Buscar registros",
                                  }),
                                ],
                              }),
                              current.status &&
                                _jsxs("label", {
                                  className: "status-filter",
                                  children: [
                                    _jsx(SlidersHorizontal, { size: 16 }),
                                    _jsxs("select", {
                                      "aria-label": "Filtrar por estado",
                                      value: statusFilter,
                                      onChange: (e) => {
                                        setStatusFilter(e.target.value);
                                        setPage(1);
                                      },
                                      children: [
                                        _jsx("option", {
                                          value: "",
                                          children: "Todos los estados",
                                        }),
                                        esPaginaSolicitudes &&
                                          _jsx("option", {
                                            value: "Solicitada",
                                            children: "Solicitada",
                                          }),
                                        [
                                          ...new Set(
                                            currentRows.map(
                                              (r) => r[current.status],
                                            ),
                                          ),
                                        ]
                                          .filter(
                                            (v) =>
                                              v !== null && v !== undefined,
                                          )
                                          .map((v) =>
                                            _jsx(
                                              "option",
                                              {
                                                value: String(v),
                                                children:
                                                  typeof v === "boolean"
                                                    ? v
                                                      ? "Activo"
                                                      : "Inactivo"
                                                    : String(v),
                                              },
                                              String(v),
                                            ),
                                          ),
                                      ],
                                    }),
                                  ],
                                }),
                              _jsx("button", {
                                className: "icon-btn refresh",
                                "aria-label": "Actualizar registros",
                                onClick: () => void refresh(),
                                disabled: loading,
                                children: _jsx(RefreshCw, {
                                  size: 18,
                                  className: loading ? "spin" : "",
                                }),
                              }),
                            ],
                          }),
                          loading
                            ? _jsxs("section", {
                                className: "empty tall",
                                children: [
                                  _jsx(LoaderCircle, { className: "spin" }),
                                  _jsx("span", {
                                    children: "Cargando registros\u2026",
                                  }),
                                ],
                              })
                            : shown.length
                              ? current.id === "producto"
                                ? _jsx(CatalogoFarmacia, {
                                    productos: currentRows,
                                    mostrados: shown,
                                    alVer: (row) =>
                                      setDialog({
                                        kind: "view",
                                        module: current,
                                        row,
                                      }),
                                    alEditar: (row) =>
                                      setDialog({
                                        kind: "form",
                                        module: current,
                                        row,
                                      }),
                                    alEliminar: (row) =>
                                      setDialog({
                                        kind: "delete",
                                        module: current,
                                        row,
                                      }),
                                  })
                                : _jsx("section", {
                                  className: "table-scroll",
                                  children: _jsxs("table", {
                                    children: [
                                      _jsx("thead", {
                                        children: _jsxs("tr", {
                                          children: [
                                            _jsx("th", {
                                              children: "REGISTRO",
                                            }),
                                            current.columns.map((k) =>
                                              _jsx(
                                                "th",
                                                {
                                                  children: _jsxs("button", {
                                                    onClick: () =>
                                                      setSort((s) => ({
                                                        key: k,
                                                        reverse:
                                                          s.key === k
                                                            ? !s.reverse
                                                            : false,
                                                      })),
                                                    children: [
                                                      current.fields.find(
                                                        (f) => f.key === k,
                                                      )?.label,
                                                      sort.key === k &&
                                                        _jsx(ArrowDown, {
                                                          size: 12,
                                                          className:
                                                            sort.reverse
                                                              ? "rotate"
                                                              : "",
                                                        }),
                                                    ],
                                                  }),
                                                },
                                                k,
                                              ),
                                            ),
                                            _jsx("th", {
                                              className: "actions-heading",
                                              children: "ACCIONES",
                                            }),
                                          ],
                                        }),
                                      }),
                                      _jsx("tbody", {
                                        children: shown.map((row) =>
                                          _jsxs(
                                            "tr",
                                            {
                                              children: [
                                                _jsxs("td", {
                                                  className: "record-id",
                                                  children: [
                                                    "#",
                                                    claveRegistro(current, row),
                                                  ],
                                                }),
                                                current.columns.map((k) =>
                                                  _jsx(
                                                    "td",
                                                    {
                                                      children:
                                                        k === current.status
                                                          ? _jsx(Badge, {
                                                              value: row[k],
                                                            })
                                                          : _jsx("span", {
                                                              className:
                                                                "cell-text",
                                                              title:
                                                                mostrarDato(
                                                                  current,
                                                                  row,
                                                                  k,
                                                                  db,
                                                                ),
                                                              children:
                                                                mostrarDato(
                                                                  current,
                                                                  row,
                                                                  k,
                                                                  db,
                                                                ),
                                                            }),
                                                    },
                                                    k,
                                                  ),
                                                ),
                                                _jsx("td", {
                                                  children: _jsxs("nav", {
                                                    className: "row-actions",
                                                    "aria-label":
                                                      "Acciones de " +
                                                      nombreRegistro(
                                                        current,
                                                        row,
                                                        db,
                                                      ),
                                                    children: [
                                                      _jsx("button", {
                                                        className: "icon-btn",
                                                        "aria-label":
                                                          "Ver " +
                                                          nombreRegistro(
                                                            current,
                                                            row,
                                                            db,
                                                          ),
                                                        onClick: () =>
                                                          setDialog({
                                                            kind: "view",
                                                            module: current,
                                                            row,
                                                          }),
                                                        children: _jsx(Eye, {
                                                          size: 16,
                                                        }),
                                                      }),
                                                      _jsx("button", {
                                                        className: "icon-btn",
                                                        "aria-label":
                                                          "Editar " +
                                                          nombreRegistro(
                                                            current,
                                                            row,
                                                            db,
                                                          ),
                                                        onClick: () =>
                                                          setDialog({
                                                            kind: "form",
                                                            module: current,
                                                            row,
                                                          }),
                                                        children: _jsx(Pencil, {
                                                          size: 16,
                                                        }),
                                                      }),
                                                      _jsx("button", {
                                                        className:
                                                          "icon-btn delete",
                                                        "aria-label":
                                                          "Eliminar " +
                                                          nombreRegistro(
                                                            current,
                                                            row,
                                                            db,
                                                          ),
                                                        onClick: () =>
                                                          setDialog({
                                                            kind: "delete",
                                                            module: current,
                                                            row,
                                                          }),
                                                        children: _jsx(Trash2, {
                                                          size: 16,
                                                        }),
                                                      }),
                                                    ],
                                                  }),
                                                }),
                                              ],
                                            },
                                            claveRegistro(current, row),
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                                })
                              : _jsxs("section", {
                                  className: "empty tall",
                                  children: [
                                    _jsx(Search, { size: 30 }),
                                    _jsx("strong", {
                                      children: loadError
                                        ? "Información no disponible"
                                        : query || statusFilter
                                          ? "No hay coincidencias"
                                          : "Aún no hay registros",
                                    }),
                                    _jsx("span", {
                                      children:
                                        query || statusFilter
                                          ? "Intenta otra búsqueda o cambia el filtro."
                                          : "Usa el botón de registrar para agregar el primero.",
                                    }),
                                  ],
                                }),
                          _jsxs("nav", {
                            className: "pagination",
                            "aria-label": "Paginaci\u00F3n",
                            children: [
                              _jsx("span", {
                                children: filtered.length
                                  ? "Mostrando " +
                                    ((safePage - 1) * 8 + 1) +
                                    "–" +
                                    Math.min(safePage * 8, filtered.length) +
                                    " de " +
                                    filtered.length +
                                    (current.id === "producto"
                                      ? " productos"
                                      : " registros")
                                  : current.id === "producto"
                                    ? "0 productos"
                                    : "0 registros",
                              }),
                              _jsxs("section", {
                                children: [
                                  _jsx("button", {
                                    className: "icon-btn",
                                    "aria-label": "P\u00E1gina anterior",
                                    disabled: safePage <= 1,
                                    onClick: () => setPage(safePage - 1),
                                    children: _jsx(ChevronLeft, { size: 17 }),
                                  }),
                                  _jsxs("span", {
                                    children: [safePage, " / ", pages],
                                  }),
                                  _jsx("button", {
                                    className: "icon-btn",
                                    "aria-label": "P\u00E1gina siguiente",
                                    disabled: safePage >= pages,
                                    onClick: () => setPage(safePage + 1),
                                    children: _jsx(ChevronRight, { size: 17 }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      current.keys.length > 1 &&
                        _jsxs("p", {
                          className: "context-note",
                          children: [
                            _jsx(CircleHelp, { size: 16 }),
                            "Cada detalle se identifica por la combinaci\u00F3n de sus dos registros relacionados.",
                          ],
                        }),
                    ],
                  }),
              _jsxs("footer", {
                className: "page-footer",
                children: [
                  _jsxs("span", {
                    className: "footer-brand",
                    children: [
                      _jsx(MarcaClinica, { className: "marca-pequena" }),
                      "Wilson \u00B7 Cl\u00EDnica Familiar",
                    ],
                  }),
                  _jsx("span", {
                    children: "Atención cercana para cada familia.",
                  }),
                  _jsx("a", {
                    href: "/html/quienes-somos.html",
                    children: "Qui\u00E9nes somos",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      toast &&
        _jsxs("output", {
          className: "toast",
          role: "status",
          children: [
            _jsx(CheckCircle2, { size: 19 }),
            toast,
            _jsx("button", {
              "aria-label": "Cerrar aviso",
              onClick: () => setToast(""),
              children: _jsx(X, { size: 16 }),
            }),
          ],
        }),
      dialog?.kind === "form" &&
        _jsx(FormDialog, {
          module: dialog.module,
          row: dialog.row,
          db: db,
          onClose: () => setDialog(null),
          onSave: save,
        }),
      dialog?.kind === "view" &&
        dialog.row &&
        _jsx(RecordDialog, {
          m: dialog.module,
          row: dialog.row,
          db: db,
          onClose: () => setDialog(null),
        }),
      dialog?.kind === "delete" &&
        dialog.row &&
        _jsx(DeleteDialog, {
          m: dialog.module,
          row: dialog.row,
          db: db,
          onClose: () => setDialog(null),
          onDelete: remove,
        }),
    ],
  });
}
