import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { SupabaseDoctorGuard } from './supabase-doctor.guard.js';

@Module({
  controllers: [AuthController],
  providers: [SupabaseDoctorGuard],
  exports: [SupabaseDoctorGuard],
})
export class AuthModule {}
