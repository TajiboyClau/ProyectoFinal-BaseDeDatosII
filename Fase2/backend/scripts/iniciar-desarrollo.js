import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const carpetaBackend = fileURLToPath(new URL('../', import.meta.url));
const carpetaFrontend = resolve(carpetaBackend, '../frontend');
const procesos = [];
let cerrando = false;

function iniciar(nombre, archivo, argumentos, carpeta) {
  const proceso = spawn(process.execPath, [archivo, ...argumentos], {
    cwd: carpeta,
    stdio: 'inherit',
    env: process.env,
  });

  proceso.on('error', (error) => {
    console.error(`No se pudo iniciar ${nombre}: ${error.message}`);
    detener();
  });

  proceso.on('exit', (codigo) => {
    if (!cerrando && codigo !== 0) {
      console.error(`${nombre} se detuvo con error.`);
      detener(codigo || 1);
    }
  });

  procesos.push(proceso);
}

function detener(codigo = 0) {
  if (cerrando) return;
  cerrando = true;
  for (const proceso of procesos) {
    if (!proceso.killed) proceso.kill();
  }
  process.exitCode = codigo;
}

process.on('SIGINT', () => detener());
process.on('SIGTERM', () => detener());

iniciar(
  'backend',
  resolve(carpetaBackend, 'node_modules/@nestjs/cli/bin/nest.js'),
  ['start', '--watch'],
  carpetaBackend,
);

iniciar(
  'frontend',
  resolve(carpetaFrontend, 'node_modules/vite/bin/vite.js'),
  [
    '--host',
    '127.0.0.1',
    '--port',
    '5173',
    '--open',
    '/html/inicio-sesion.html',
  ],
  carpetaFrontend,
);
