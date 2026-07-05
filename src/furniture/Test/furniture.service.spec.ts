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
});