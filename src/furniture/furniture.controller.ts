import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateFurnitureDto } from './dto/create-furniture.dto';
import { UpdateFurnitureDto } from './dto/update-furniture.dto';
import { FurnitureService } from './furniture.service';

@Controller('furniture')
export class FurnitureController {
  constructor(private readonly furnitureService: FurnitureService) {}

  // Browsing the catalog stays public -- these GET routes have no guard.

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

  // Only a logged-in caller can change the catalog.
  // (There's no admin-only role check yet -- any authenticated user can
  // create/edit/delete furniture for now; see the coaching notes.)

  // This creates a new furniture item
  @UseGuards(JwtAuthGuard)
  @Post()
  createFurniture(@Body() data: CreateFurnitureDto) {
    return this.furnitureService.createFurniture(data);
  }

  // This updates an existing furniture item
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateFurniture(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateFurnitureDto,
  ) {
    return this.furnitureService.updateFurniture(id, data);
  }

  // This deletes a furniture item
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteFurniture(@Param('id', ParseIntPipe) id: number) {
    return this.furnitureService.deleteFurniture(id);
  }
}
