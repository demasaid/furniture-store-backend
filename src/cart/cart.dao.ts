import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { OrderStatus, PrismaClient } from '@prisma/client';

@Injectable()
export class CartDao
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // =========================
  // CART
  // =========================

  getCart(userId: number) {
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

  createCart(userId: number) {
    return this.cart.create({
      data: {
        userId,
        total: 0,
      },
    });
  }

  findFurnitureById(furnitureId: number) {
    return this.furniture.findUnique({
      where: { id: furnitureId },
    });
  }

  findCartItem(cartId: number, furnitureId: number) {
    return this.cartItem.findFirst({
      where: {
        cartId,
        furnitureId,
      },
    });
  }

  createCartItem(
    cartId: number,
    furnitureId: number,
    quantity: number,
    price: number,
  ) {
    return this.cartItem.create({
      data: {
        cartId,
        furnitureId,
        quantity,
        price,
      },
    });
  }

  updateCartItemQuantity(cartItemId: number, quantity: number) {
    return this.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
  }

  removeCartItem(cartItemId: number) {
    return this.cartItem.delete({
      where: { id: cartItemId },
    });
  }

  clearCart(cartId: number) {
    return this.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async updateCartTotal(cartId: number) {
    const items = await this.cartItem.findMany({
      where: { cartId },
    });

    const total = items.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    return this.cart.update({
      where: { id: cartId },
      data: { total },
      include: {
        items: {
          include: {
            furniture: true,
          },
        },
      },
    });
  }

  // =========================
  // ORDERS
  // =========================

  getAllOrders() {
    return this.order.findMany({
      include: {
        items: {
          include: {
            furniture: true,
          },
        },
        user: true,
      },
    });
  }

  getOrdersByUserId(userId: number) {
    return this.order.findMany({
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

  getOrderById(id: number) {
    return this.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            furniture: true,
          },
        },
        user: true,
      },
    });
  }

  async checkout(userId: number) {
    const cart = await this.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return null;
    }

    if (cart.items.length === 0) {
      return null;
    }

    const order = await this.order.create({
      data: {
        userId,
        total: cart.total,
        items: {
          create: cart.items.map((item) => ({
            furnitureId: item.furnitureId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    await this.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await this.cart.update({
      where: {
        id: cart.id,
      },
      data: {
        total: 0,
      },
    });

    // Stock was only ever checked when items were added to the cart --
    // it was never actually reduced, so the same furniture could be
    // "bought" over and over without ever running out. Reduce it now
    // that the order is confirmed.
    for (const item of cart.items) {
      await this.furniture.update({
        where: { id: item.furnitureId },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    return order;
  }

  updateOrderStatus(id: number, status: OrderStatus) {
    return this.order.update({
      where: { id },
      data: { status },
    });
  }
}