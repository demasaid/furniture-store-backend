import { Module } from '@nestjs/common';

import { JwtConfigModule } from '../common/jwt-config.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { OtpService } from './otp.service';

@Module({
  imports: [
    UsersModule,
    JwtConfigModule,
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    OtpService,
    JwtAuthGuard,
  ],

  // Exported so other modules (users, cart, furniture) can use
  // JwtAuthGuard to protect their own routes.
  exports: [JwtAuthGuard],
})
export class AuthModule {}