import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta ${name} en el archivo .env del backend`);
  return value;
}

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: required('DB_HOST'),
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: required('DB_USERNAME'),
  password: required('DB_PASSWORD'),
  database: required('DB_DATABASE'),
  schema: 'public',
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  retryAttempts: 2,
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: true,
          ...(process.env.DB_SSL_CA
            ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n') }
            : {}),
        }
      : false,
}));
