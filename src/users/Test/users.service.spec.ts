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
    jest.clearAllMocks();

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

  mockUsersDao.getAllUsers.mockResolvedValue(users);

  const result = await service.getAllUsers();

  expect(result).toEqual(users);
  expect(mockUsersDao.getAllUsers).toHaveBeenCalled();
});

  it('should return user by id', async () => {
  const user = {
    id: 1,
    name: 'Dema Saed',
    email: 'dema@example.com',
    password: '123456',
    address: 'Haifa',
  };

  mockUsersDao.getUserById.mockResolvedValue(user);

  const result = await service.getUserById(1);

  expect(result).toEqual(user);
  expect(mockUsersDao.getUserById).toHaveBeenCalledWith(1);
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

    mockUsersDao.createUser.mockResolvedValue(createdUser);

    const result = await service.createUser(data);

    expect(result).toEqual(createdUser);
    expect(mockUsersDao.createUser).toHaveBeenCalledWith(data);
  });

  it('should update user', async () => {
  const user = {
    id: 1,
    name: 'Dema Saed',
    email: 'dema@example.com',
    password: '123456',
    address: 'Haifa',
  };

  const updateData = {
    name: 'Dema Updated',
  };

  const updatedUser = {
    ...user,
    ...updateData,
  };

  mockUsersDao.getUserById.mockResolvedValue(user);
  mockUsersDao.updateUser.mockResolvedValue(updatedUser);

  const result = await service.updateUser(1, updateData);

  expect(result).toEqual(updatedUser);
  expect(mockUsersDao.getUserById).toHaveBeenCalledWith(1);
  expect(mockUsersDao.updateUser).toHaveBeenCalledWith(1, updateData);
});
it('should delete user', async () => {
  const user = {
    id: 1,
    name: 'Dema Saed',
    email: 'dema@example.com',
    password: '123456',
    address: 'Haifa',
  };

  mockUsersDao.getUserById.mockResolvedValue(user);
  mockUsersDao.deleteUser.mockResolvedValue(user);

  const result = await service.deleteUser(1);

  expect(result).toEqual(user);
  expect(mockUsersDao.getUserById).toHaveBeenCalledWith(1);
  expect(mockUsersDao.deleteUser).toHaveBeenCalledWith(1);
});

});