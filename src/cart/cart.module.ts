import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartDao } from './cart.dao';

@Module({
  controllers: [CartController],
  providers: [CartService,CartDao],
})
export class CartModule {}
