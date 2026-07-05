
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { MainDao } from './dao';
import { usersData } from './data';

@Injectable()
export class FurnitureService {
  constructor(private readonly mainDao: MainDao) {}

// This gets all furniture items, so the user can see the full store inventory
async getAllFurniture() {
  return this.mainDao.findAllFurniture();
}

// This gets one furniture item by id and makes sure it really exists
async getFurnitureById(id: number) {
  const item = await this.mainDao.findFurnitureById(id);

  if (!item) {
    throw new NotFoundException('Furniture item was not found');
  }

  return item;
}

// This creates a new furniture item after checking the important values
async createFurniture(data: any) {
  if (!data.name) {
    throw new BadRequestException('Furniture name is required');
  }

  if (data.price <= 0) {
    throw new BadRequestException('Price must be greater than zero');
  }

  if (data.quantity < 0) {
    throw new BadRequestException('Quantity cannot be negative');
  }

  return this.mainDao.createFurniture(data);
}

// This updates a furniture item only after we make sure it exists
async updateFurniture(id: number, data: any) {
  await this.getFurnitureById(id);

  return this.mainDao.updateFurniture(id, data);
}

// This deletes a furniture item only after checking that it exists
async deleteFurniture(id: number) {
  await this.getFurnitureById(id);

  return this.mainDao.deleteFurniture(id);
}

// This searches for furniture items using optional filters like name, category, and price
async searchFurniture(filters: any) {
  return this.mainDao.searchFurniture(filters);
}

// This returns extra details about the item, like final price with tax and availability
async getFurnitureDetails(id: number) {
  const item = await this.getFurnitureById(id);

  const taxRate = 0.17;
  const priceAfterDiscount = item.price;
  const finalPrice = priceAfterDiscount * (1 + taxRate);

  return {
    ...item,
    priceAfterDiscount,
    finalPrice,
    isAvailable: item.quantity > 0,
  };
}

// This updates the stock quantity of a furniture item
async updateStock(furnitureId: number, newQuantity: number) {
  if (newQuantity < 0) {
    throw new BadRequestException('Stock quantity cannot be negative');
  }

  await this.getFurnitureById(furnitureId);

  return this.mainDao.updateFurniture(furnitureId, {
    quantity: newQuantity,
  });
}
//2
// This gets all users from the database
async getAllUsers() {
  return this.mainDao.findAllUsers();
}

// This gets one user by id and checks if the user exists
async getUserById(id: number) {
  const user = await this.mainDao.findUserById(id);

  if (!user) {
    throw new NotFoundException('User was not found');
  }

  return user;
}

// This creates a new user after checking the required fields and email
async createUser(data: any) {
  if (!data.name || !data.email || !data.password) {
    throw new BadRequestException('Name, email and password are required');
  }

  const existingUser = await this.mainDao.findUserByEmail(data.email);

  if (existingUser) {
    throw new BadRequestException('Email already exists');
  }

  return this.mainDao.createUser(data);
}

// This updates a user only after making sure the user exists
async updateUser(id: number, data: any) {
  await this.getUserById(id);

  return this.mainDao.updateUser(id, data);
}

// This deletes a user only after making sure the user exists
async deleteUser(id: number) {
  await this.getUserById(id);

  return this.mainDao.deleteUser(id);
}
// 3
// This gets the user's cart, and if the user does not have one yet, it creates a new cart
async getCart(userId: number) {
  await this.getUserById(userId);

  let cart = await this.mainDao.findCartByUserId(userId);

  if (!cart) {
    await this.mainDao.createCart(userId);
    cart = await this.mainDao.findCartByUserId(userId);
  }

  if (!cart) {
    throw new NotFoundException('Cart could not be created');
  }

  return cart;
}

// This adds a furniture item to the user's cart after checking the stock quantity
async addItemToCart(userId: number, furnitureId: number, quantity: number) {
  if (quantity <= 0) {
    throw new BadRequestException('Quantity must be greater than zero');
  }

  const furniture = await this.getFurnitureById(furnitureId);

  if (furniture.quantity < quantity) {
    throw new BadRequestException('Not enough stock available');
  }

  const cart = await this.getCart(userId);

  const existingItem = await this.mainDao.findCartItem(cart.id, furnitureId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;

    if (furniture.quantity < newQuantity) {
      throw new BadRequestException('Not enough stock available');
    }

    return this.mainDao.updateCartItem(existingItem.id, newQuantity);
  }

  return this.mainDao.createCartItem({
    cartId: cart.id,
    furnitureId,
    quantity,
  });
}

// This changes the quantity of a specific item inside the user's cart
async updateCartItemQuantity(
  userId: number,
  furnitureId: number,
  quantity: number,
) {
  if (quantity <= 0) {
    throw new BadRequestException('Quantity must be greater than zero');
  }

  const cart = await this.getCart(userId);

  const item = await this.mainDao.findCartItem(cart.id, furnitureId);

  if (!item) {
    throw new NotFoundException('Item was not found in cart');
  }

  const furniture = await this.getFurnitureById(furnitureId);

  if (furniture.quantity < quantity) {
    throw new BadRequestException('Not enough stock available');
  }

  return this.mainDao.updateCartItem(item.id, quantity);
}

// This removes one furniture item from the user's cart
async removeItemFromCart(userId: number, furnitureId: number) {
  const cart = await this.getCart(userId);

  const item = await this.mainDao.findCartItem(cart.id, furnitureId);

  if (!item) {
    throw new NotFoundException('Item was not found in cart');
  }

  return this.mainDao.deleteCartItem(item.id);
}

// This removes all items from the user's cart
async clearCart(userId: number) {
  const cart = await this.getCart(userId);

  return this.mainDao.clearCart(cart.id);
}
//4 
// This completes the order by checking the cart, updating the stock, creating an order, and clearing the cart
// This completes the order by checking the cart, updating the stock, creating the order items, and clearing the cart
async checkout(userId: number) {
  const cart = await this.getCart(userId);

  if (!cart.items || cart.items.length === 0) {
    throw new BadRequestException('Cart is empty');
  }

  let totalOrderPrice = 0;

  const orderItems: {
  furnitureId: number;
  quantity: number;
  unitPrice: number;
}[] = [];

  for (const item of cart.items) {
    if (item.furniture.quantity < item.quantity) {
      throw new BadRequestException(
        `Not enough stock for ${item.furniture.name}`,
      );
    }

    const taxRate = 0.17;
    const unitPrice = item.furniture.price * (1 + taxRate);

    totalOrderPrice += unitPrice * item.quantity;

    orderItems.push({
      furnitureId: item.furnitureId,
      quantity: item.quantity,
      unitPrice,
    });
  }

  for (const item of cart.items) {
    const newStock = item.furniture.quantity - item.quantity;

    await this.mainDao.updateFurniture(item.furnitureId, {
      quantity: newStock,
    });
  }

  const order = await this.mainDao.createOrder({
    userId,
    totalPrice: totalOrderPrice,
    status: 'PENDING',
    items: {
      create: orderItems,
    },
  });

  await this.mainDao.clearCart(cart.id);

  return {
    message: 'Checkout completed successfully',
    orderId: order.id,
    totalPrice: totalOrderPrice,
    items: order.items,
  };
}
// This gets all orders in the system
async getAllOrders() {
  return this.mainDao.findAllOrders();
}

// This gets all orders that belong to a specific user
async getOrdersByUserId(userId: number) {
  await this.getUserById(userId);

  return this.mainDao.findOrdersByUserId(userId);
}

// This gets one order by id and checks if it exists
async getOrderById(id: number) {
  const order = await this.mainDao.findOrderById(id);

  if (!order) {
    throw new NotFoundException('Order was not found');
  }

  return order;
}

// This updates the order status after making sure the order exists
async updateOrderStatus(id: number, status: any) {
  await this.getOrderById(id);

  return this.mainDao.updateOrderStatus(id, status);
}



  findUserById(id: string) {
    return  usersData.find((item) => item.id === id);
  }
}