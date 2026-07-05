import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CartDao } from './cart.dao';

@Injectable()
export class CartService {
  constructor(private readonly cartDao: CartDao) {}

  // This gets the user's cart if it exists.
  // If the user does not have a cart yet, it creates a new one.
  private async getOrCreateCart(userId: number) {
    const existingCart = await this.cartDao.getCart(userId);

    if (existingCart) {
      return existingCart;
    }

    return this.cartDao.createCart(userId);
  }

  // =========================
  // CART
  // =========================

  // This returns the user's cart
  async getCart(userId: number) {
    return this.getOrCreateCart(userId);
  }

  // This adds a furniture item to the user's cart
  async addItemToCart(
    userId: number,
    furnitureId: number,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const furniture = await this.cartDao.findFurnitureById(furnitureId);

    if (!furniture) {
      throw new NotFoundException('Furniture item not found');
    }

    const cart = await this.getOrCreateCart(userId);

    const existingItem = await this.cartDao.findCartItem(
      cart.id,
      furnitureId,
    );

    if (existingItem) {
      await this.cartDao.updateCartItemQuantity(
        existingItem.id,
        existingItem.quantity + quantity,
      );
    } else {
      await this.cartDao.createCartItem(
        cart.id,
        furnitureId,
        quantity,
        furniture.price,
      );
    }

    return this.cartDao.updateCartTotal(cart.id);
  }

  // This updates the quantity of an item inside the cart
  async updateCartItemQuantity(
    userId: number,
    furnitureId: number,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    const cart = await this.cartDao.getCart(userId);

    if (cart === null) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartDao.findCartItem(cart.id, furnitureId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartDao.updateCartItemQuantity(item.id, quantity);

    return this.cartDao.updateCartTotal(cart.id);
  }

  // This removes one item from the user's cart
  async removeItemFromCart(userId: number, furnitureId: number) {
    const cart = await this.cartDao.getCart(userId);

    if (cart === null) {
      throw new NotFoundException('Cart not found');
    }

    const item = await this.cartDao.findCartItem(cart.id, furnitureId);

    if (!item) {
      throw new NotFoundException('Item not found in cart');
    }

    await this.cartDao.removeCartItem(item.id);

    return this.cartDao.updateCartTotal(cart.id);
  }

  // This clears all items from the user's cart
  async clearCart(userId: number) {
    const cart = await this.cartDao.getCart(userId);

    if (cart === null) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartDao.clearCart(cart.id);

    return this.cartDao.updateCartTotal(cart.id);
  }

  // =========================
  // ORDERS
  // =========================

  // This returns all orders
  getAllOrders() {
    return this.cartDao.getAllOrders();
  }

  // This returns all orders that belong to one user
  getOrdersByUserId(userId: number) {
    return this.cartDao.getOrdersByUserId(userId);
  }

  // This returns one order by id
  async getOrderById(id: number) {
    const order = await this.cartDao.getOrderById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // This converts the cart into an order
  async checkout(userId: number) {
    const order = await this.cartDao.checkout(userId);

    if (!order) {
      throw new BadRequestException('Cart is empty or does not exist');
    }

    return order;
  }

  // This updates the order status
  async updateOrderStatus(id: number, status: any) {
    const order = await this.cartDao.getOrderById(id);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.cartDao.updateOrderStatus(id, status);
  }
}