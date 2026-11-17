import { BadRequestException, Injectable } from '@nestjs/common';
import type { PipeTransform } from '@nestjs/common';

@Injectable()
export class IdPositivoPipe implements PipeTransform<string, number> {
  transform(valor: string): number {
    if (!/^\d+$/.test(valor))
      throw new BadRequestException(
        'El identificador debe ser un entero positivo',
      );
    const id = Number(valor);
    if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
      throw new BadRequestException(
        'El identificador está fuera del rango permitido',
      );
    }
    return id;
  }
}
