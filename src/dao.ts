import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MainDao extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  // Open database connection when the app starts
  async onModuleInit() {
    await this.$connect();
  }

  // Close database connection when the app stops
  async onModuleDestroy() {
    await this.$disconnect();
  }

 
  // FURNITURE


  // Get all furniture items
  findAllFurniture() {
    return this.furniture.findMany();
  }

  // Get one furniture item by id
  findFurnitureById(id: number) {
    return this.furniture.findUnique({
      where: { id },
    });
  }

  // Create a new furniture item
  createFurniture(data: any) {
    return this.furniture.create({ data });
  }

  // Update an existing furniture item
  updateFurniture(id: number, data: any) {
    return this.furniture.update({
      where: { id },
      data,
    });
  }

  // Delete a furniture item
  deleteFurniture(id: number) {
    return this.furniture.delete({
      where: { id },
    });
  }

  // Search furniture by filters (name, category, price range)
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

        category: filters.category,

        price: {
          gte: filters.minPrice,
          lte: filters.maxPrice,
        },
      },
    });
  }

  
  // USER

  // Create a new user
  createUser(data: any) {
    return this.user.create({ data });
  }

  // Find user by email
  findUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  
  // CART
 

  // Add item to cart
  createCartItem(data: any) {
    return this.cartItem.create({ data });
  }

  
  // ORDER


  // Create a new order
  createOrder(data: any) {
    return this.order.create({ data });
  }
}