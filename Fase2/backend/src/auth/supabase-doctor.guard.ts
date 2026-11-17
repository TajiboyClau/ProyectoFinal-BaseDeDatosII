import {
  CanActivate,
  ForbiddenException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
  type ExecutionContext,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import type { Request } from 'express';

export interface DoctorIdentity {
  doctorId: number;
  doctorNombre: string;
  doctorApellido: string;
  correo: string;
}

export interface DoctorRequest extends Request {
  doctor?: DoctorIdentity;
}

interface SupabaseUser {
  email?: string;
  email_confirmed_at?: string | null;
  confirmed_at?: string | null;
}

@Injectable()
export class SupabaseDoctorGuard implements CanActivate {
  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<DoctorRequest>();
    if (!request.path.startsWith('/api/')) return true;
    // La solicitud pública solo permite crear una cita pendiente; el resto de la API exige sesión.
    if (request.method === 'POST' && request.path === '/api/cita/publica') {
      return true;
    }

    const token = this.bearerToken(request.headers.authorization);
    if (!token)
      throw new UnauthorizedException('Inicia sesión para continuar.');

    const supabaseUrl = this.config
      .get<string>('SUPABASE_URL')
      ?.replace(/\/$/, '');
    const apiKey = this.config.get<string>('SUPABASE_PUBLISHABLE_KEY');
    if (!supabaseUrl || !apiKey) {
      throw new ServiceUnavailableException(
        'Falta configurar la autenticación de Supabase en el backend.',
      );
    }

    let response: Response;
    try {
      response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${token}` },
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      throw new ServiceUnavailableException(
        'No se pudo validar la sesión con Supabase Auth.',
      );
    }
    if (response.status === 401 || response.status === 403) {
      throw new UnauthorizedException(
        'La sesión venció. Inicia sesión de nuevo.',
      );
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(
        'Supabase Auth no pudo validar la sesión en este momento.',
      );
    }

    const user = (await response.json()) as SupabaseUser;
    const email = user.email?.trim().toLowerCase();
    if (!email || !(user.email_confirmed_at || user.confirmed_at)) {
      throw new UnauthorizedException(
        'Usa una cuenta de doctor con el correo confirmado.',
      );
    }

    const doctors = (await this.dataSource.query(
      `SELECT doctor_id AS "doctorId",
              doctor_nombre AS "doctorNombre",
              doctor_apellido AS "doctorApellido",
              correo
         FROM public.doctor
        WHERE lower(trim(correo)) = $1
        ORDER BY doctor_id
        LIMIT 2`,
      [email],
    )) as DoctorIdentity[];
    if (doctors.length !== 1) {
      throw new ForbiddenException(
        'Esta cuenta no está asociada a un doctor habilitado de la clínica.',
      );
    }

    request.doctor = doctors[0];
    return true;
  }

  private bearerToken(value?: string): string | null {
    const match = value?.match(/^Bearer\s+([^\s]+)$/i);
    return match?.[1] ?? null;
  }
}
