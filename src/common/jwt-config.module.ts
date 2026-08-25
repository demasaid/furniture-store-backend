import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

// Shared JWT setup, used by AuthModule (to sign tokens) and by every
// module whose controller needs JwtAuthGuard (to verify tokens).
// It lives on its own so those modules don't have to import AuthModule
// directly, which would create a circular dependency
// (AuthModule already imports UsersModule).
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        const jwtSecret = configService.get<string>('JWT_SECRET');

        if (!jwtSecret) {
          throw new Error(
            'JWT_SECRET is missing from the .env file',
          );
        }

        return {
          secret: jwtSecret,

          signOptions: {
            expiresIn: 3600,
          },
        };
      },
    }),
  ],

  exports: [JwtModule],
})
export class JwtConfigModule {}
