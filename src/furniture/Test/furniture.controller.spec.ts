import { Test, TestingModule } from '@nestjs/testing';
import { FurnitureController } from '../furniture.controller';
import { FurnitureService } from '../furniture.service';

describe('FurnitureController', () => {
  let controller: FurnitureController;

  const mockFurnitureService = {
    getAllFurniture: jest.fn(),
    getFurnitureById: jest.fn(),
    createFurniture: jest.fn(),
    updateFurniture: jest.fn(),
    deleteFurniture: jest.fn(),
    searchFurniture: jest.fn(),
  };

  beforeEach(async () => {
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
});