import { Module } from '@nestjs/common';
import {
  AppController,
  FurnitureController,
  UserController,
  CartController,
  OrderController,
} from './app.controller';

import { FurnitureService } from './app.service';
import { MainDao } from './dao';

@Module({
  imports: [],
  controllers: [
    AppController,
    FurnitureController,
    UserController,
    CartController,
    OrderController,
  ],
  providers: [FurnitureService, MainDao],
})
export class AppModule {}
