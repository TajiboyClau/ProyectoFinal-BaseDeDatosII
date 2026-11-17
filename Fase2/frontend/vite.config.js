import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { "/api": { target: "http://127.0.0.1:3000", changeOrigin: true } },
  },
  build: {
    rollupOptions: {
      input: {
        inicio: resolve(projectRoot, "html/inicio.html"),
        acceso: resolve(projectRoot, "html/inicio-sesion.html"),
        citas: resolve(projectRoot, "html/citas.html"),
        solicitudes: resolve(projectRoot, "html/solicitudes.html"),
        atencion: resolve(projectRoot, "html/atencion.html"),
        equipo: resolve(projectRoot, "html/equipo.html"),
        farmacia: resolve(projectRoot, "html/farmacia.html"),
        ventas: resolve(projectRoot, "html/ventas.html"),
        pagos: resolve(projectRoot, "html/pagos.html"),
        catalogos: resolve(projectRoot, "html/catalogos.html"),
        quienesSomos: resolve(projectRoot, "html/quienes-somos.html"),
      },
    },
  },
});
