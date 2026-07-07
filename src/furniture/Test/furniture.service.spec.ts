import { Test, TestingModule } from '@nestjs/testing';
import { FurnitureService } from '../furniture.service';
import { FurnitureDao } from '../furniture.dao';

describe('FurnitureService', () => {
  let service: FurnitureService;

  const mockFurnitureDao = {
    findAllFurniture: jest.fn(),
    findFurnitureById: jest.fn(),
    createFurniture: jest.fn(),
    updateFurniture: jest.fn(),
    deleteFurniture: jest.fn(),
    searchFurniture: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FurnitureService,
        {
          provide: FurnitureDao,
          useValue: mockFurnitureDao,
        },
      ],
    }).compile();

    service = module.get<FurnitureService>(FurnitureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

    mockFurnitureDao.findAllFurniture.mockResolvedValue(furnitureList);

    const result = await service.getAllFurniture();

    expect(result).toEqual(furnitureList);
    expect(mockFurnitureDao.findAllFurniture).toHaveBeenCalled();
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

    mockFurnitureDao.findFurnitureById.mockResolvedValue(furniture);

    const result = await service.getFurnitureById(1);

    expect(result).toEqual(furniture);
    expect(mockFurnitureDao.findFurnitureById).toHaveBeenCalledWith(1);
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

    mockFurnitureDao.createFurniture.mockResolvedValue(createdFurniture);

    const result = await service.createFurniture(data);

    expect(result).toEqual(createdFurniture);
    expect(mockFurnitureDao.createFurniture).toHaveBeenCalledWith(data);
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

    mockFurnitureDao.updateFurniture.mockResolvedValue(updatedFurniture);

    const result = await service.updateFurniture(1, data);

    expect(result).toEqual(updatedFurniture);
    expect(mockFurnitureDao.updateFurniture).toHaveBeenCalledWith(1, data);
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

    mockFurnitureDao.deleteFurniture.mockResolvedValue(deletedFurniture);

    const result = await service.deleteFurniture(1);

    expect(result).toEqual(deletedFurniture);
    expect(mockFurnitureDao.deleteFurniture).toHaveBeenCalledWith(1);
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

    mockFurnitureDao.searchFurniture.mockResolvedValue(searchResult);

    const result = await service.searchFurniture(filters);

    expect(result).toEqual(searchResult);
    expect(mockFurnitureDao.searchFurniture).toHaveBeenCalledWith(filters);
  });
});