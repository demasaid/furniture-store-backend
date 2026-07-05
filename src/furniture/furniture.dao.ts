import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client';

@Injectable()
export class FurnitureDao
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  findAllFurniture() {
    return this.furniture.findMany();
  }

  // This gets one furniture item using its id
  findFurnitureById(id: number) {
    return this.furniture.findUnique({
      where: { id },
    });
  }

  // This adds a new furniture item to the database
  createFurniture(data: any) {
    return this.furniture.create({ data });
  }

  // This updates an existing furniture item using its id
  updateFurniture(id: number, data: any) {
    return this.furniture.update({
      where: { id },
      data,
    });
  }

  // This deletes a furniture item from the database using its id
  deleteFurniture(id: number) {
    return this.furniture.delete({
      where: { id },
    });
  }

  // This searches for furniture items by name, category, or price range
  searchFurniture(filters: {
    name?: string;
    category?: any;
    minPrice?: number;
    maxPrice?: number;
  }) {
    return this.furniture.findMany({
      where: {
        name: filters.name
          ? { contains: filters.name, mode: 'insensitive' }
          : undefined,

        category: filters.category || undefined,

        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
      },
    });
  }

}
