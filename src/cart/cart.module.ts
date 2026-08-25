import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtConfigModule } from '../common/jwt-config.module';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartDao } from './cart.dao';

@Module({
  imports: [JwtConfigModule],
  controllers: [CartController],
  providers: [CartService, CartDao, JwtAuthGuard],
})
export class CartModule {}
