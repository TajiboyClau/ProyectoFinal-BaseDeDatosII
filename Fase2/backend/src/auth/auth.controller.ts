import { Controller, Get, Req } from '@nestjs/common';
import type { DoctorRequest } from './supabase-doctor.guard.js';

@Controller('auth')
export class AuthController {
  @Get('me')
  getDoctor(@Req() request: DoctorRequest) {
    return request.doctor;
  }
}
