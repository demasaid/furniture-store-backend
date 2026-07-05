import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from '../cart.controller';
import { CartService } from '../cart.service';

describe('CartController', () => {
  let controller: CartController;

  const mockCartService = {
    getCart: jest.fn(),
    addItemToCart: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeItemFromCart: jest.fn(),
    clearCart: jest.fn(),
    getAllOrders: jest.fn(),
    getOrdersByUserId: jest.fn(),
    getOrderById: jest.fn(),
    checkout: jest.fn(),
    updateOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
