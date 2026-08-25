import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtConfigModule } from '../common/jwt-config.module';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { UserDao } from './user.dao';

@Module({
  // JwtConfigModule gives us JwtService so JwtAuthGuard can verify
  // tokens on this module's routes.
  imports: [JwtConfigModule],
  controllers: [UsersController],
  providers: [UsersService, UserDao, JwtAuthGuard],

  // AuthModule imports UsersModule specifically to inject UsersService
  // into AuthService (to look users up during signup/signin). A provider
  // is only visible outside its own module if it's listed here.
  exports: [UsersService],
})
export class UsersModule {}
