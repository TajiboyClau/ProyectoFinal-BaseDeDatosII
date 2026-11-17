import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

// Los campos opcionales admiten NULL solo cuando la tabla lo permite.
function opcional(esOpcional: boolean): PropertyDecorator[] {
  return esOpcional
    ? [
        ValidateIf(
          (_objeto, valor: unknown) => valor !== undefined && valor !== null,
        ),
      ]
    : [];
}

export function Texto(longitud: number, esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim() : value,
    ),
    IsString(),
    MaxLength(longitud),
    ...(esOpcional ? [] : [IsNotEmpty()]),
  );
}

export function DpiGuatemala(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.trim().replace(/[-\s]/g, '') : value,
    ),
    IsString(),
    Matches(/^\d{13}$/, {
      message: 'El DPI debe tener 13 dígitos con formato 0000-00000-0000.',
    }),
  );
}

export function TelefonoGuatemala(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    Transform(({ value }: { value: unknown }) => {
      if (typeof value !== 'string') return value;
      return value.trim().replace(/^\+?502/, '').replace(/[\s()-]/g, '');
    }),
    IsString(),
    Matches(/^\d{8}$/, {
      message: 'El teléfono debe tener 8 dígitos de Guatemala.',
    }),
  );
}

export function Referencia(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    IsInt(),
    Min(1),
    Max(2147483647),
  );
}

export function Decimal(
  positivo = true,
  esOpcional = false,
): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    IsNumber({ maxDecimalPlaces: 2 }),
    positivo ? IsPositive() : Min(0),
    Max(99999999.99),
  );
}

export function Fecha(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    IsDateString({ strict: true }),
    Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'Usa una fecha válida con formato AAAA-MM-DD',
    }),
  );
}

export function Hora(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    IsString(),
    Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
      message: 'Usa una hora válida con formato HH:mm o HH:mm:ss',
    }),
  );
}

export function FechaHora(esOpcional = false): PropertyDecorator {
  return applyDecorators(
    ...opcional(esOpcional),
    IsDateString({ strict: true }),
    Matches(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[+-]\d{2}:\d{2})$/,
      {
        message:
          'Usa fecha y hora ISO con zona horaria, por ejemplo 2026-10-28T14:00:00Z',
      },
    ),
  );
}
