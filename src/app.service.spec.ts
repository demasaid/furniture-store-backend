import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FurnitureService } from './app.service';
import { MainDao } from './dao';

describe('FurnitureService', () => {
  let service: FurnitureService;

  const mockMainDao = {
    findAllFurniture: jest.fn(),
    findFurnitureById: jest.fn(),
    createFurniture: jest.fn(),
    updateFurniture: jest.fn(),
    deleteFurniture: jest.fn(),
    searchFurniture: jest.fn(),
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    findUserByEmail: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FurnitureService,
        {
          provide: MainDao,
          useValue: mockMainDao,
        },
      ],
    }).compile();

    service = module.get<FurnitureService>(FurnitureService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all furniture items', async () => {
    const furnitureItems = [
      {
        id: 1,
        name: 'Wooden Chair',
        description: 'Comfortable wooden chair',
        price: 250,
        dimensions: '50x50x90',
        quantity: 10,
        category: 'CHAIR',
      },
    ];

    mockMainDao.findAllFurniture.mockResolvedValue(furnitureItems);

    const result = await service.getAllFurniture();

    expect(result).toEqual(furnitureItems);
    expect(mockMainDao.findAllFurniture).toHaveBeenCalled();
  });

  it('should throw NotFoundException when furniture item does not exist', async () => {
    mockMainDao.findFurnitureById.mockResolvedValue(null);

    await expect(service.getFurnitureById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create furniture when data is valid', async () => {
    const data = {
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 250,
      dimensions: '50x50x90',
      quantity: 10,
      category: 'CHAIR',
    };

    const createdItem = {
      id: 1,
      ...data,
    };

    mockMainDao.createFurniture.mockResolvedValue(createdItem);

    const result = await service.createFurniture(data);

    expect(result).toEqual(createdItem);
    expect(mockMainDao.createFurniture).toHaveBeenCalledWith(data);
  });

  it('should throw BadRequestException when furniture name is missing', async () => {
    const data = {
      description: 'Comfortable wooden chair',
      price: 250,
      dimensions: '50x50x90',
      quantity: 10,
      category: 'CHAIR',
    };

    await expect(service.createFurniture(data)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when price is not positive', async () => {
    const data = {
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 0,
      dimensions: '50x50x90',
      quantity: 10,
      category: 'CHAIR',
    };

    await expect(service.createFurniture(data)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when quantity is negative', async () => {
    const data = {
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 250,
      dimensions: '50x50x90',
      quantity: -1,
      category: 'CHAIR',
    };

    await expect(service.createFurniture(data)).rejects.toThrow(
      BadRequestException,
      

    
    );
  });
    it('should return all users', async () => {
    const users = [
      {
        id: 1,
        name: 'Dema',
        email: 'dema@test.com',
        password: '123456',
        address: 'Haifa',
      },
    ];

    mockMainDao.findAllUsers.mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(result).toEqual(users);
    expect(mockMainDao.findAllUsers).toHaveBeenCalled();
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockMainDao.findUserById.mockResolvedValue(null);

    await expect(service.getUserById(99)).rejects.toThrow(
      NotFoundException,
    );
  });
});


