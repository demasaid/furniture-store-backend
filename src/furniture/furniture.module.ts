import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtConfigModule } from '../common/jwt-config.module';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';
import { FurnitureDao } from './furniture.dao';

@Module({
  imports: [JwtConfigModule],
  controllers: [FurnitureController],
  providers: [FurnitureService, FurnitureDao, JwtAuthGuard],
})
export class FurnitureModule {}
