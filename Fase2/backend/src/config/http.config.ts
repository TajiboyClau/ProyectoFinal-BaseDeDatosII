import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { DatabaseExceptionFilter } from './database-exception.filter.js';

export function configurarHttp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  const origins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    ...(process.env.FRONTEND_URL ?? '')
      .split(',')
      .map((origin) => origin.trim()),
  ]);
  for (let port = 5174; port <= 5180; port++) {
    origins.add(`http://localhost:${port}`);
    origins.add(`http://127.0.0.1:${port}`);
  }
  app.enableCors({
    origin: [...origins],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new DatabaseExceptionFilter());
}
