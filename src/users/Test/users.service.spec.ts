import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user.service';
import { UserDao } from '../user.dao';

describe('UsersService', () => {
  let service: UsersService;

  const mockUsersDao = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    getUserByEmail: jest.fn(),
    findUserByPhone: jest.fn(),
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
        firstName: 'Dema',
        lastName: 'Saed',
        email: 'dema@example.com',
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
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      address: 'Haifa',
    };

    mockUsersDao.getUserById.mockResolvedValue(user);

    const result = await service.getUserById(1);

    expect(result).toEqual(user);
    expect(mockUsersDao.getUserById).toHaveBeenCalledWith(1);
  });

  // createUser() is the low-level insert used internally by
  // AuthService.signup with an already-prepared, already-hashed object.
  // It must be a pure passthrough -- it used to re-validate `data.name`
  // and `data.password`, fields that don't exist on that object, which
  // made every real signup fail.
  it('should create user (pure passthrough, no re-validation)', async () => {
    const data = {
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      passwordHash: 'already-hashed',
      isTFAEnabled: false,
    };

    const createdUser = { id: 1, ...data };

    mockUsersDao.createUser.mockResolvedValue(createdUser);

    const result = await service.createUser(data as any);

    expect(result).toEqual(createdUser);
    expect(mockUsersDao.createUser).toHaveBeenCalledWith(data);
  });

  // createUserAccount() backs POST /users. It receives a raw plaintext
  // password and must hash it and check for duplicate email/phone,
  // exactly like signup does.
  describe('createUserAccount', () => {
    const dto = {
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'Dema@Example.com',
      password: 'password123',
      address: 'Haifa',
    };

    it('hashes the password and normalizes the email before saving', async () => {
      mockUsersDao.getUserByEmail.mockResolvedValue(null);
      mockUsersDao.createUser.mockImplementation((data) =>
        Promise.resolve({ id: 1, ...data }),
      );

      const result = await service.createUserAccount(dto);

      expect(mockUsersDao.getUserByEmail).toHaveBeenCalledWith(
        'dema@example.com',
      );

      const savedData = mockUsersDao.createUser.mock.calls[0][0];
      expect(savedData.email).toBe('dema@example.com');
      expect(savedData.passwordHash).not.toBe(dto.password);
      expect(
        await bcrypt.compare(dto.password, savedData.passwordHash),
      ).toBe(true);
      expect(result.id).toBe(1);
    });

    it('rejects an email that is already registered', async () => {
      mockUsersDao.getUserByEmail.mockResolvedValue({ id: 99 });

      await expect(service.createUserAccount(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(mockUsersDao.createUser).not.toHaveBeenCalled();
    });
  });

  it('should update user', async () => {
    const user = {
      id: 1,
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      address: 'Haifa',
    };

    const updateData = {
      firstName: 'Updated',
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
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
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
