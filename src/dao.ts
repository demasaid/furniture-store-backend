import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MainDao extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  
  // This runs when the app starts and opens the connection with the database
  async onModuleInit() {
    await this.$connect();
  }

  // This runs when the app stops and closes the database connection safely
  async onModuleDestroy() {
    await this.$disconnect();
  }

  // This gets all furniture items from the database
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

  // This gets all users from the database
  findAllUsers() {
    return this.user.findMany();
  }

  // This gets one user using the user id
  findUserById(id: number) {
    return this.user.findUnique({
      where: { id },
    });
  }

  // This searches for a user using the email address
  findUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  // This creates a new user in the database
  createUser(data: any) {
    return this.user.create({ data });
  }

  // This updates an existing user using the user id
  updateUser(id: number, data: any) {
    return this.user.update({
      where: { id },
      data,
    });
  }

  // This deletes a user from the database using the user id
  deleteUser(id: number) {
    return this.user.delete({
      where: { id },
    });
  }

  // This gets the cart that belongs to a specific user
  findCartByUserId(userId: number) {
    return this.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            furniture: true,
          },
        },
      },
    });
  }

  // This creates a new empty cart for a user
  createCart(userId: number) {
    return this.cart.create({
      data: { userId },
    });
  }

  // This checks if a specific furniture item already exists inside a cart
  findCartItem(cartId: number, furnitureId: number) {
    return this.cartItem.findFirst({
      where: {
        cartId,
        furnitureId,
      },
    });
  }

  // This adds a new item to the cart
  createCartItem(data: any) {
    return this.cartItem.create({ data });
  }

  // This updates the quantity of an item inside the cart
  updateCartItem(id: number, quantity: number) {
    return this.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  // This removes one item from the cart
  deleteCartItem(id: number) {
    return this.cartItem.delete({
      where: { id },
    });
  }

  // This removes all items from a specific cart
  clearCart(cartId: number) {
    return this.cartItem.deleteMany({
      where: { cartId },
    });
  }

  // This gets all orders from the database
  findAllOrders() {
    return this.order.findMany();
  }

  // This gets all orders that belong to one user
  findOrdersByUserId(userId: number) {
    return this.order.findMany({
      where: { userId },
    });
  }

  // This gets one order using the order id
  findOrderById(id: number) {
    return this.order.findUnique({
      where: { id },
    });
  }

  
  // This creates a new order with all the items that were bought
createOrder(data: any) {
  return this.order.create({
    data,
    include: {
      items: true,
    },
  });
}

  // This updates the status of an existing order
  updateOrderStatus(id: number, status: any) {
    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}