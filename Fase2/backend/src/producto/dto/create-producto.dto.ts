import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsPositive,
  Max,
  MaxLength,
  ValidateIf,
} from 'class-validator';
export class CreateProductoDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreProducto: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(99999999.99)
  precioProducto: number;

  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean()
  estadoProducto?: boolean;
}
