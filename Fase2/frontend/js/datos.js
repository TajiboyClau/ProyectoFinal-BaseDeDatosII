import { buscarModulo, modulos, claveRegistro } from "./modelo.js";
import { obtenerToken } from "./autenticacion.js";
export function valoresFormulario(m, row) {
  const values = Object.fromEntries(
    m.fields.map((f) => {
      const value = row?.[f.key];
      if (value === null || value === undefined)
        return [f.key, f.kind === "boolean" ? "true" : ""];
      if (f.kind === "timestamp") {
        const date = new Date(String(value));
        if (Number.isNaN(date.valueOf())) return [f.key, ""];
        const local = new Date(
          date.valueOf() - date.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .slice(0, 19);
        return [f.key, local];
      }
      return [f.key, String(value)];
    }),
  );
  if (!row && m.id === "pagos") {
    const ahora = new Date();
    const fechaLocal = new Date(
      ahora.valueOf() - ahora.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 19);
    values.fechaPago = fechaLocal;
    values.estadoPago = "Pagado";
  }
  return values;
}
export function prepararDatos(m, values, original) {
  const payload = {};
  for (const field of m.fields) {
    if (original && m.keys.includes(field.key)) continue;
    const raw = (values[field.key] ?? "").trim();
    if (!raw) {
      if (field.required)
        throw new Error(field.label + ": este dato es obligatorio.");
      payload[field.key] = null;
      continue;
    }
    if (field.maxLength && raw.length > field.maxLength)
      throw new Error(field.label + ": excede la longitud permitida.");
    let value = raw;
    if (field.kind === "number" || field.kind === "reference") {
      value = Number(raw);
      if (!Number.isFinite(value))
        throw new Error(field.label + ": escribe un número válido.");
      if (
        field.kind === "reference" &&
        (!Number.isInteger(value) || value < 1 || value > 2147483647)
      )
        throw new Error(field.label + ": selecciona un registro válido.");
      if (
        field.kind === "number" &&
        (value < (field.min ?? 0) ||
          value > 99999999.99 ||
          Math.abs(value * 100 - Math.round(value * 100)) > 0.00001)
      )
        throw new Error(
          field.label +
            ": usa un monto o cantidad válido con hasta dos decimales.",
        );
    } else if (field.kind === "boolean") {
      if (!["true", "false"].includes(raw)) throw new Error("Estado inválido.");
      value = raw === "true";
    } else if (field.kind === "date") {
      const parsed = new Date(raw + "T00:00:00Z");
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(raw) ||
        Number.isNaN(parsed.valueOf()) ||
        parsed.toISOString().slice(0, 10) !== raw
      )
        throw new Error("Fecha inválida.");
    } else if (field.kind === "time") {
      if (!/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(raw))
        throw new Error("Hora inválida.");
    } else if (field.kind === "timestamp") {
      const parsed = new Date(raw);
      if (Number.isNaN(parsed.valueOf()))
        throw new Error("Fecha y hora inválidas.");
      value = parsed.toISOString();
    }
    payload[field.key] = value;
  }
  if (original) {
    for (const field of m.fields) {
      if (!(field.key in payload)) continue;
      let prev = original[field.key] ?? null;
      if (field.kind === "number" && prev !== null) prev = Number(prev);
      if (field.kind === "timestamp" && prev)
        prev = new Date(String(prev)).toISOString();
      if (field.kind === "time" && prev) prev = String(prev).slice(0, 5);
      const next =
        field.kind === "time" && payload[field.key]
          ? String(payload[field.key]).slice(0, 5)
          : payload[field.key];
      if (prev === next) delete payload[field.key];
    }
    if (!Object.keys(payload).length)
      throw new Error("No hay cambios para guardar.");
  }
  return payload;
}
export class RepositorioApi {
  base;
  token;
  constructor(
    base = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, ""),
    token = obtenerToken,
  ) {
    this.base = base;
    this.token = token;
  }
  async request(path, method = "GET", body) {
    let response;
    const token = this.token();
    const headers = {};
    if (body) headers["Content-Type"] = "application/json";
    if (token) headers.Authorization = `Bearer ${token}`;
    try {
      response = await fetch(this.base + path, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      throw new Error(
        "No se pudo conectar con el backend. Comprueba que esté iniciado y que su .env esté configurado.",
      );
    }
    const text = await response.text();
    let result;
    try {
      result = text ? JSON.parse(text) : null;
    } catch {
      throw new Error("El backend no devolvió una respuesta JSON válida.");
    }
    if (!response.ok) {
      const message =
        result && typeof result === "object" && "message" in result
          ? result.message
          : null;
      throw new Error(
        Array.isArray(message)
          ? message.join(" · ")
          : typeof message === "string"
            ? message
            : "No se pudo completar la operación.",
      );
    }
    return result;
  }
  async load() {
    const results = await Promise.allSettled(
      modulos.map(async (m) => {
        const rows = await this.request("/" + m.id);
        if (!Array.isArray(rows))
          throw new Error("Respuesta inválida en " + m.title);
        return [m.id, rows];
      }),
    );
    const failed = results.flatMap((r, i) =>
      r.status === "rejected"
        ? [
            modulos[i].title +
              ": " +
              (r.reason instanceof Error ? r.reason.message : "Error de carga"),
          ]
        : [],
    );
    if (failed.length)
      throw new Error(
        failed[0] +
          (failed.length > 1
            ? " (" + failed.length + " módulos sin cargar)"
            : ""),
      );
    return Object.fromEntries(
      results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : [])),
    );
  }
  async create(m, data) {
    await this.request("/" + m.id, "POST", data);
  }
  async update(m, row, data) {
    await this.request("/" + m.id + "/" + claveRegistro(m, row), "PATCH", data);
  }
  async remove(m, row) {
    await this.request("/" + m.id + "/" + claveRegistro(m, row), "DELETE");
  }
}
export function exportarCsv(m, rows, db, format) {
  const escape = (v) => {
    const safe = /^[=+\-@\t\r]/.test(v) ? "'" + v : v;
    return '"' + safe.replaceAll('"', '""') + '"';
  };
  const keys = [
    ...m.keys,
    ...m.fields.map((f) => f.key).filter((k) => !m.keys.includes(k)),
  ];
  return (
    "\ufeff" +
    [
      keys.map((k) => m.fields.find((f) => f.key === k)?.label ?? k),
      ...rows.map((row) =>
        keys.map((k) =>
          m.keys.includes(k) ? String(row[k]) : format(m, row, k, db),
        ),
      ),
    ]
      .map((r) => r.map(escape).join(","))
      .join("\r\n")
  );
}
