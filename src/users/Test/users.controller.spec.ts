import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../user.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const users = [
      {
        id: 1,
        name: 'Dema Saed',
        email: 'dema@example.com',
        password: '123456',
        address: 'Haifa',
      },
    ];

    mockUsersService.getAllUsers.mockResolvedValue(users);

    const result = await controller.getAllUsers();

    expect(result).toEqual(users);
    expect(mockUsersService.getAllUsers).toHaveBeenCalled();
  });

  it('should return user by id', async () => {
    const user = {
      id: 1,
      name: 'Dema Saed',
      email: 'dema@example.com',
      password: '123456',
      address: 'Haifa',
    };

    mockUsersService.getUserById.mockResolvedValue(user);

    const result = await controller.getUserById(1);

    expect(result).toEqual(user);
    expect(mockUsersService.getUserById).toHaveBeenCalledWith(1);
  });

  it('should create user', async () => {
    const data = {
      name: 'Dema Saed',
      email: 'dema@example.com',
      password: '123456',
      address: 'Haifa',
    };

    const createdUser = {
      id: 1,
      ...data,
    };

    mockUsersService.createUser.mockResolvedValue(createdUser);

    const result = await controller.createUser(data);

    expect(result).toEqual(createdUser);
    expect(mockUsersService.createUser).toHaveBeenCalledWith(data);
  });

  it('should update user', async () => {
    const data = {
      name: 'Dema Updated',
      address: 'Tel Aviv',
    };

    const updatedUser = {
      id: 1,
      name: 'Dema Updated',
      email: 'dema@example.com',
      password: '123456',
      address: 'Tel Aviv',
    };

    mockUsersService.updateUser.mockResolvedValue(updatedUser);

    const result = await controller.updateUser(1, data);

    expect(result).toEqual(updatedUser);
    expect(mockUsersService.updateUser).toHaveBeenCalledWith(1, data);
  });

  it('should delete user', async () => {
    const deletedUser = {
      id: 1,
      name: 'Dema Saed',
      email: 'dema@example.com',
      password: '123456',
      address: 'Haifa',
    };

    mockUsersService.deleteUser.mockResolvedValue(deletedUser);

    const result = await controller.deleteUser(1);

    expect(result).toEqual(deletedUser);
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1);
  });
});