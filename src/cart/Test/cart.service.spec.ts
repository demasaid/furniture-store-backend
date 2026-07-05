import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../cart.service';
import { CartDao } from '../cart.dao';

describe('CartService', () => {
  let service: CartService;

  const mockCartDao = {
    getCart: jest.fn(),
    createCart: jest.fn(),
    findFurnitureById: jest.fn(),
    findCartItem: jest.fn(),
    createCartItem: jest.fn(),
    updateCartItemQuantity: jest.fn(),
    removeCartItem: jest.fn(),
    clearCart: jest.fn(),
    updateCartTotal: jest.fn(),
    getAllOrders: jest.fn(),
    getOrdersByUserId: jest.fn(),
    getOrderById: jest.fn(),
    checkout: jest.fn(),
    updateOrderStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: CartDao,
          useValue: mockCartDao,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});