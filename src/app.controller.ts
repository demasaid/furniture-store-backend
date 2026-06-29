import { Controller, Get, Post, Body, Param, ParseIntPipe, Query } from '@nestjs/common';
import { FurnitureService } from './app.service';



@Controller('furniture')
export class FurnitureController {
  // We inject the service here so we can access all the business logic we wrote earlier
  constructor(private readonly furnitureService: FurnitureService) {}

  // This endpoint handles fetching detailed information about a specific furniture item including prices
  @Get(':id/details')
  async getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.furnitureService.getFurnitureDetails(id);
  }

  // This endpoint allows users to search and filter furniture items by name, category, or price range
  @Get('search')
  async searchFurniture(@Query() filters: { name?: string; category?: any; minPrice?: number; maxPrice?: number }) {
    return this.furnitureService.search(filters);
  }

  // This endpoint processes the entire checkout sequence when a user wants to purchase items from their cart
  @Post('checkout')
  async checkout(@Body() body: { userId: number; cartItems: Array<{ furnitureId: number; quantity: number }> }) {
    return this.furnitureService.processCheckout(body.userId, body.cartItems);
  }
}
