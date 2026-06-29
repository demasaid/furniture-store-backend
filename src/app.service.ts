
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
    <h1> Dema </h1>
    <h3> Saed </h3>
    `;
  }
}

import { MainDao } from './dao';

@Injectable()
export class FurnitureService {
  constructor(private readonly mainDao: MainDao) {}

  // This function fetches the furniture item and calculates its final price including tax and discount
  async getFurnitureDetails(id: number) {
    const item = await this.mainDao.findFurnitureById(id);
    if (!item) throw new NotFoundException('The requested item does not exist');

    // We assume a standard tax rate here and deduct any available discount from the base price
    const discount = item.discount || 0; 
    const taxRate = 0.17; 
    
    const priceAfterDiscount = item.price - discount;
    const finalPrice = priceAfterDiscount * (1 + taxRate);

    return {
      ...item,
      priceAfterDiscount,
      finalPrice,
      isAvailable: item.quantity > 0,
    };
  }

  // This handles the search functionality by passing the filters directly to our data access object
  async search(filters: { name?: string; category?: any; minPrice?: number; maxPrice?: number }) {
    return this.mainDao.searchFurniture(filters);
  }

  // We use this function to keep the inventory accurate by updating the available stock quantity
  async updateStock(furnitureId: number, newQuantity: number) {
    if (newQuantity < 0) throw new BadRequestException('Stock quantity cannot be a negative number');
    
    return this.mainDao.updateFurniture(furnitureId, {
      quantity: newQuantity
    });
  }

  // This is the core logic that handles the checkout workflow by verifying stock, calculating totals, and creating the order
  async processCheckout(userId: number, cartItems: Array<{ furnitureId: number, quantity: number }>) {
    
    let totalOrderPrice = 0;
    const itemsToBuy: any[] = [];

    // First we loop through all items in the cart to verify they exist and that we have enough stock available
    for (const cartItem of cartItems) {
      const furniture = await this.mainDao.findFurnitureById(cartItem.furnitureId);
      
      if (!furniture) {
        throw new NotFoundException(`Item number ${cartItem.furnitureId} was not found in the system`);
      }

      if (furniture.quantity < cartItem.quantity) {
        throw new BadRequestException(`Sorry but the requested quantity for ${furniture.name} is not available in our stock`);
      }

      // Here we calculate the final price for this specific item after applying discounts and taxes
      const itemTax = 0.17;
      const singlePrice = (furniture.price - (furniture.discount || 0)) * (1 + itemTax);
      totalOrderPrice += singlePrice * cartItem.quantity;

      // We temporarily store the valid items so we can update their stock levels later
      itemsToBuy.push({
        furnitureId: furniture.id,
        currentStock: furniture.quantity,
        requestedQuantity: cartItem.quantity
      });
    }

    // Second we deduct the purchased quantities from the inventory stock
    for (const item of itemsToBuy) {
      const updatedStock = item.currentStock - item.requestedQuantity;
      await this.updateStock(item.furnitureId, updatedStock);
    }

    // Third we record the completed transaction by creating a new order entry in the database
    const newOrder = await this.mainDao.createOrder({
      userId: userId,
      totalPrice: totalOrderPrice,
      status: 'PENDING',
    });

    // Fourth we simulate a successful payment process to finalize the checkout
    const paymentSuccess = true;

    if (paymentSuccess) {
      return {
        message: 'The purchase was successful and the inventory has been updated',
        orderId: newOrder.id,
        totalPaid: totalOrderPrice
      };
    } else {
      throw new BadRequestException('Payment process failed');
    }
  }
}