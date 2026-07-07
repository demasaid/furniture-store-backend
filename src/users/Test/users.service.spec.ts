import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../user.service';
import { UserDao } from '../user.dao';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersDao = {
    findAllUsers: jest.fn(),
    findUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
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

    mockUsersDao.findAllUsers.mockResolvedValue(users);

    const result = await service.getAllUsers();

    expect(result).toEqual(users);
    expect(mockUsersDao.findAllUsers).toHaveBeenCalled();
  });

  it('should return user by id', async () => {
    const user = {
      id: 1,
      name: 'Dema Saed',
      email: 'dema@example.com',
      password: '123456',
      address: 'Haifa',
    };

    mockUsersDao.findUserById.mockResolvedValue(user);

    const result = await service.getUserById(1);

    expect(result).toEqual(user);
    expect(mockUsersDao.findUserById).toHaveBeenCalledWith(1);
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

    mockUsersDao.updateUser.mockResolvedValue(updatedUser);

    const result = await service.updateUser(1, data);

    expect(result).toEqual(updatedUser);
    expect(mockUsersDao.updateUser).toHaveBeenCalledWith(1, data);
  });

  it('should delete user', async () => {
    const deletedUser = {
      id: 1,
      name: 'Dema Saed',
      email: 'dema@example.com',
      password: '123456',
      address: 'Haifa',
    };

    mockUsersDao.deleteUser.mockResolvedValue(deletedUser);

    const result = await service.deleteUser(1);

    expect(result).toEqual(deletedUser);
    expect(mockUsersDao.deleteUser).toHaveBeenCalledWith(1);
  });
});