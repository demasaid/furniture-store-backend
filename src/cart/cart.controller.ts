import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // =========================
  // CART
  // =========================

  // Get user's cart
  @Get('user/:userId')
  getCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getCart(userId);
  }

  // Add furniture item to cart
  @Post('add')
  addItemToCart(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
      quantity: number;
    },
  ) {
    return this.cartService.addItemToCart(
      body.userId,
      body.furnitureId,
      body.quantity,
    );
  }

  // Update cart item quantity
  @Patch('update')
  updateCartItem(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
      quantity: number;
    },
  ) {
    return this.cartService.updateCartItemQuantity(
      body.userId,
      body.furnitureId,
      body.quantity,
    );
  }

  // Remove item from cart
  @Delete('remove')
  removeItemFromCart(
    @Body()
    body: {
      userId: number;
      furnitureId: number;
    },
  ) {
    return this.cartService.removeItemFromCart(
      body.userId,
      body.furnitureId,
    );
  }

  // Clear all items from user's cart
  @Delete('clear/:userId')
  clearCart(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.clearCart(userId);
  }

  // =========================
  // ORDERS
  // =========================

  // Get all orders
  @Get('orders')
  getAllOrders() {
    return this.cartService.getAllOrders();
  }

  // Get all orders for specific user
  @Get('orders/user/:userId')
  getOrdersByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.getOrdersByUserId(userId);
  }

  // Get one order by order id
  @Get('orders/:orderId')
  getOrderById(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.cartService.getOrderById(orderId);
  }

  // Convert cart to order
  @Post('checkout/:userId')
  checkout(@Param('userId', ParseIntPipe) userId: number) {
    return this.cartService.checkout(userId);
  }

  // Update order status
  @Patch('orders/:orderId/status')
  updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() body: { status: any },
  ) {
    return this.cartService.updateOrderStatus(orderId, body.status);
  }
}