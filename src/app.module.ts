import { Module } from '@nestjs/common';
import { AppController } from './app.controller';

import { FurnitureModule } from './furniture/furniture.module';
import { UsersModule } from './users/users.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [FurnitureModule, UsersModule, CartModule],
  controllers: [AppController],
})
export class AppModule {}