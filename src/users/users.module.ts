import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './users.controller';
import { UserDao } from './user.dao';


@Module({
  controllers: [UsersController],
  providers: [UsersService,UserDao],
})
export class UsersModule {}
