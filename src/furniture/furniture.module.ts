import { Module } from '@nestjs/common';
import { FurnitureService } from './furniture.service';
import { FurnitureController } from './furniture.controller';
import { FurnitureDao } from './furniture.dao';

@Module({
  controllers: [FurnitureController],
  providers: [FurnitureService],
})
export class FurnitureModule {}
