const SESSION_KEY = "wilson-doctor-session-v1";
const apiBase = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
function supabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, "");
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Falta configurar VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY en frontend/.env.",
    );
  }
  return { url, key };
}
async function readMessage(response, servicio) {
  const body = await response.json().catch(() => null);
  const message =
    body?.message ?? body?.msg ?? body?.error_description ?? body?.error;
  if (typeof message === "string") return message;
  if (Array.isArray(message)) return message.join(" · ");
  const code = body?.code ?? body?.error_code;
  if (code === "invalid_credentials" || code === "invalid_grant") {
    return "Supabase no reconoce esa combinación de correo y contraseña. Comprueba que la cuenta esté creada en el mismo proyecto que usa la clínica.";
  }
  if (code === "email_not_confirmed") {
    return "La cuenta existe, pero el correo aún no está confirmado. Activa la confirmación del correo en Supabase Auth y vuelve a intentarlo.";
  }
  if (code) return `Supabase rechazó el acceso (${code}).`;
  if (!body) {
    return `${servicio} respondió con un formato inesperado (HTTP ${response.status}).`;
  }
  return "No se pudo iniciar sesión. Revisa el correo y la contraseña.";
}
function storeSession(session) {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}
export function obtenerToken() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session.accessToken || session.expiresAt <= Date.now()) {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session.accessToken;
  } catch {
    window.sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}
export function obtenerDoctorGuardado() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    return session.expiresAt > Date.now() && session.doctor?.doctorId
      ? session.doctor
      : null;
  } catch {
    return null;
  }
}
export async function iniciarSesionDoctor(email, password) {
  const { url, key } = supabaseConfig();
  let loginResponse;
  try {
    loginResponse = await fetch(`${url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: key, "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error("No se pudo conectar al servicio de inicio de sesión.");
  }
  if (!loginResponse.ok) {
    throw new Error(await readMessage(loginResponse, "Supabase Auth"));
  }
  const login = await loginResponse.json();
  if (!login.access_token || !Number.isFinite(login.expires_in)) {
    throw new Error(
      "El servicio de inicio de sesión devolvió una respuesta inválida.",
    );
  }
  let profileResponse;
  try {
    profileResponse = await fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${login.access_token}` },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new Error(
      "No se pudo validar que esta cuenta pertenezca a un doctor de la clínica.",
    );
  }
  if (!profileResponse.ok) {
    throw new Error(
      await readMessage(profileResponse, "El backend de la clínica"),
    );
  }
  const doctor = await profileResponse.json();
  storeSession({
    accessToken: login.access_token,
    expiresAt: Date.now() + login.expires_in * 1000,
    doctor,
  });
  return doctor;
}
export async function validarSesionDoctor() {
  const accessToken = obtenerToken();
  if (!accessToken) return null;
  try {
    const response = await fetch(`${apiBase}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      window.sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    const doctor = await response.json();
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    const previous = raw ? JSON.parse(raw) : null;
    if (!previous) return null;
    storeSession({ ...previous, doctor });
    return doctor;
  } catch {
    return obtenerDoctorGuardado();
  }
}
export async function cerrarSesionDoctor() {
  const token = obtenerToken();
  window.sessionStorage.removeItem(SESSION_KEY);
  if (!token) return;
  try {
    const { url, key } = supabaseConfig();
    await fetch(`${url}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
  } catch {}
}
