import { Catch } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(error: QueryFailedError, host: ArgumentsHost): void {
    const code = (error.driverError as { code?: string }).code;
    const mensajes: Record<string, [number, string]> = {
      '23503': [
        409,
        'El registro está relacionado con otros datos o la referencia no existe',
      ],
      '23505': [409, 'Ya existe un registro con ese identificador'],
      '23502': [400, 'Falta un dato obligatorio'],
      '23514': [400, 'Los datos no cumplen las restricciones de la tabla'],
      P0001: [
        400,
        'La base de datos rechazó la operación por una regla del negocio',
      ],
    };
    const [statusCode, message] = mensajes[code ?? ''] ?? [
      500,
      'No se pudo completar la operación en la base de datos',
    ];
    host
      .switchToHttp()
      .getResponse<Response>()
      .status(statusCode)
      .json({ statusCode, message });
  }
}
