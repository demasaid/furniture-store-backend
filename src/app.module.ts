import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FurnitureModule } from './furniture/furniture.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [FurnitureModule, UserModule, CartModule, OrderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
