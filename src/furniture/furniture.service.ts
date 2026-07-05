import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { FurnitureDao } from './furniture.dao';

@Injectable()
export class FurnitureService {
  constructor (private readonly furnitureDao:FurnitureDao) {} 
  // This gets all furniture items, so the user can see the full store inventory
  async getAllFurniture() {
    return this.furnitureDao.findAllFurniture();
  }
  
  // This gets one furniture item by id and makes sure it really exists
  async getFurnitureById(id: number) {
    const item = await this.furnitureDao.findFurnitureById(id);
  
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
  
    return this.furnitureDao.createFurniture(data);
  }
  
  // This updates a furniture item only after we make sure it exists
  async updateFurniture(id: number, data: any) {
    await this.getFurnitureById(id);
  
    return this.furnitureDao.updateFurniture(id, data);
  }
  
  // This deletes a furniture item only after checking that it exists
  async deleteFurniture(id: number) {
    await this.getFurnitureById(id);
  
    return this.furnitureDao.deleteFurniture(id);
  }
  
  // This searches for furniture items using optional filters like name, category, and price
  async searchFurniture(filters: any) {
    return this.furnitureDao.searchFurniture(filters);
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
  
    return this.furnitureDao.updateFurniture(furnitureId, {
      quantity: newQuantity,
    });


}
}
