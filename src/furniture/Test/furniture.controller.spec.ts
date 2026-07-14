import { Test, TestingModule } from '@nestjs/testing';
import { FurnitureController } from '../furniture.controller';
import { FurnitureService } from '../furniture.service';

describe('FurnitureController', () => {
  let controller: FurnitureController;

  const mockFurnitureService = {
    getAllFurniture: jest.fn(),
    getFurnitureById: jest.fn(),
    getFurnitureDetails: jest.fn(),
    createFurniture: jest.fn(),
    updateFurniture: jest.fn(),
    deleteFurniture: jest.fn(),
    searchFurniture: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FurnitureController],
      providers: [
        {
          provide: FurnitureService,
          useValue: mockFurnitureService,
        },
      ],
    }).compile();

    controller = module.get<FurnitureController>(FurnitureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all furniture items', async () => {
    const furnitureList = [
      {
        id: 1,
        name: 'Wooden Chair',
        description: 'Comfortable wooden chair',
        price: 120,
        dimensions: '40x40x90',
        quantity: 10,
        category: 'CHAIR',
      },
    ];

    mockFurnitureService.getAllFurniture.mockResolvedValue(furnitureList);

    const result = await controller.getAllFurniture();

    expect(result).toEqual(furnitureList);
    expect(mockFurnitureService.getAllFurniture).toHaveBeenCalled();
  });

  it('should search furniture using filters', async () => {
    const filters = {
      category: 'CHAIR',
      minPrice: '100',
      maxPrice: '300',
    };

    const searchResult = [
      {
        id: 1,
        name: 'Wooden Chair',
        description: 'Comfortable wooden chair',
        price: 120,
        dimensions: '40x40x90',
        quantity: 10,
        category: 'CHAIR',
      },
    ];

    mockFurnitureService.searchFurniture.mockResolvedValue(searchResult);

    const result = await controller.searchFurniture(filters);

    expect(result).toEqual(searchResult);
    expect(mockFurnitureService.searchFurniture).toHaveBeenCalledWith(filters);
  });

  it('should return furniture details by id', async () => {
    const furnitureDetails = {
      id: 1,
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 120,
      dimensions: '40x40x90',
      quantity: 10,
      category: 'CHAIR',
      available: true,
    };

    mockFurnitureService.getFurnitureDetails.mockResolvedValue(furnitureDetails);

    const result = await controller.getFurnitureDetails(1);

    expect(result).toEqual(furnitureDetails);
    expect(mockFurnitureService.getFurnitureDetails).toHaveBeenCalledWith(1);
  });

  it('should return furniture by id', async () => {
    const furniture = {
      id: 1,
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 120,
      dimensions: '40x40x90',
      quantity: 10,
      category: 'CHAIR',
    };

    mockFurnitureService.getFurnitureById.mockResolvedValue(furniture);

    const result = await controller.getFurnitureById(1);

    expect(result).toEqual(furniture);
    expect(mockFurnitureService.getFurnitureById).toHaveBeenCalledWith(1);
  });

  it('should create furniture', async () => {
    const data = {
      name: 'Dining Table',
      description: 'Large dining table',
      price: 500,
      dimensions: '180x90x75',
      quantity: 5,
      category: 'TABLE',
    };

    const createdFurniture = {
      id: 2,
      ...data,
    };

    mockFurnitureService.createFurniture.mockResolvedValue(createdFurniture);

    const result = await controller.createFurniture(data);

    expect(result).toEqual(createdFurniture);
    expect(mockFurnitureService.createFurniture).toHaveBeenCalledWith(data);
  });

  it('should update furniture', async () => {
    const data = {
      price: 150,
      quantity: 8,
    };

    const updatedFurniture = {
      id: 1,
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 150,
      dimensions: '40x40x90',
      quantity: 8,
      category: 'CHAIR',
    };

    mockFurnitureService.updateFurniture.mockResolvedValue(updatedFurniture);

    const result = await controller.updateFurniture(1, data);

    expect(result).toEqual(updatedFurniture);
    expect(mockFurnitureService.updateFurniture).toHaveBeenCalledWith(1, data);
  });

  it('should delete furniture', async () => {
    const deletedFurniture = {
      id: 1,
      name: 'Wooden Chair',
      description: 'Comfortable wooden chair',
      price: 120,
      dimensions: '40x40x90',
      quantity: 10,
      category: 'CHAIR',
    };

    mockFurnitureService.deleteFurniture.mockResolvedValue(deletedFurniture);

    const result = await controller.deleteFurniture(1);

    expect(result).toEqual(deletedFurniture);
    expect(mockFurnitureService.deleteFurniture).toHaveBeenCalledWith(1);
  });
});