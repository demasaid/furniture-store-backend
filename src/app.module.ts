import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { FurnitureModule } from './furniture/furniture.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    FurnitureModule,
    UsersModule,
    CartModule,
    AuthModule,
  ],

  controllers: [AppController],
})
export class AppModule {}