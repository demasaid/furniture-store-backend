import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import { FurnitureService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly furnitureService: FurnitureService) {}

  @Get()
  getHello() {
    return `
      <h1>Dema</h1>
      <h3>Furniture Store API</h3>
    `;
  }
}

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

@Controller('users')
export class UserController {
  constructor(private readonly furnitureService: FurnitureService) {}

  // This returns all users
  @Get()
  getAllUsers() {
    return this.furnitureService.getAllUsers();
  }

  // This returns one user by id
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.furnitureService.getUserById(id);
  }

  // This creates a new user
  @Post()
  createUser(@Body() data: any) {
    return this.furnitureService.createUser(data);
  }

  // This updates an existing user
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.furnitureService.updateUser(id, data);
  }

  // This deletes a user
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.furnitureService.deleteUser(id);
  }
}

@Controller('cart')
export class CartController {
  constructor(private readonly furnitureService: FurnitureService) {}

  // This returns the user's cart
  @Get(':userId')
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.furnitureService.getCart(userId);
  }

  // This adds a furniture item to the user's cart
  @Post('add')
  addItemToCart(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
      quantity: number;
    },
  ) {
    return this.furnitureService.addItemToCart(
      body.userId,
      body.furnitureId,
      body.quantity,
    );
  }

  // This updates the quantity of an item inside the cart
  @Patch('update')
  updateCartItem(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
      quantity: number;
    },
  ) {
    return this.furnitureService.updateCartItemQuantity(
      body.userId,
      body.furnitureId,
      body.quantity,
    );
  }

  // This removes one item from the user's cart
  @Delete('remove')
  removeItemFromCart(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
    },
  ) {
    return this.furnitureService.removeItemFromCart(
      body.userId,
      body.furnitureId,
    );
  }

  // This clears all items from the user's cart
  @Delete('clear/:userId')
  clearCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.furnitureService.clearCart(userId);
  }
}

@Controller('orders')
export class OrderController {
  constructor(private readonly furnitureService: FurnitureService) {}

  // This returns all orders
  @Get()
  getAllOrders() {
    return this.furnitureService.getAllOrders();
  }

  // This returns all orders that belong to one user
  @Get('user/:userId')
  getOrdersByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.furnitureService.getOrdersByUserId(userId);
  }

  // This returns one order by id
  @Get(':id')
  getOrderById(@Param('id', ParseIntPipe) id: number) {
    return this.furnitureService.getOrderById(id);
  }

  // This completes the checkout process
  @Post('checkout/:userId')
  checkout(@Param('userId', ParseIntPipe) userId: number) {
    return this.furnitureService.checkout(userId);
  }

  // This updates the order status
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: any },
  ) {
    return this.furnitureService.updateOrderStatus(id, body.status);
  }
}