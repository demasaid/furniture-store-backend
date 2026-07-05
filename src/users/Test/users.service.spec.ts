import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { UserDao } from '../user.dao';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersDao = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserDao,
          useValue: mockUsersDao,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
