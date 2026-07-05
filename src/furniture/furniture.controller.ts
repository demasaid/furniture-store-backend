import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { FurnitureService } from './furniture.service';

@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  // This returns all furniture items
    @Get()
    getAllFurniture() {
      return this.furnitureService.getAllFurniture();
    }
  
    // This searches furniture using optional filters
    @Get('search')
    searchFurniture(@Query() filters: any) {
      return this.furnitureService.searchFurniture(filters);
    }
  
    // This returns extra details for one furniture item
    @Get(':id/details')
    getFurnitureDetails(@Param('id', ParseIntPipe) id: number) {
      return this.furnitureService.getFurnitureDetails(id);
    }
  
    // This returns one furniture item by its id
    @Get(':id')
    getFurnitureById(@Param('id', ParseIntPipe) id: number) {
      return this.furnitureService.getFurnitureById(id);
    }
  
    // This creates a new furniture item
    @Post()
    createFurniture(@Body() data: any) {
      return this.furnitureService.createFurniture(data);
    }
  
    // This updates an existing furniture item
    @Patch(':id')
    updateFurniture(
      @Param('id', ParseIntPipe) id: number,
      @Body() data: any,
    ) {
      return this.furnitureService.updateFurniture(id, data);
    }
  
    // This deletes a furniture item
    @Delete(':id')
    deleteFurniture(@Param('id', ParseIntPipe) id: number) {
      return this.furnitureService.deleteFurniture(id);
    }
  
}
