import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUserAccount: jest.fn(),
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
    })
      // JwtAuthGuard needs a real JwtService to be constructed. These
      // tests call controller methods directly (no HTTP layer), so the
      // guard never actually runs -- we only override it here so Nest
      // can compile the module without needing JWT_SECRET/JwtService.
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    mockUsersService.getAllUsers.mockResolvedValue(users);

    const result = await controller.getAllUsers();

    expect(result).toEqual(users);
    expect(mockUsersService.getAllUsers).toHaveBeenCalled();
  });

  it('should return user by id', async () => {
    const user = {
      id: 1,
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      address: 'Haifa',
    };

    mockUsersService.getUserById.mockResolvedValue(user);

    const result = await controller.getUserById(1);

    expect(result).toEqual(user);
    expect(mockUsersService.getUserById).toHaveBeenCalledWith(1);
  });

  it('should create user', async () => {
    const data = {
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      password: 'password123',
      address: 'Haifa',
    };

    const createdUser = {
      id: 1,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      address: data.address,
    };

    mockUsersService.createUserAccount.mockResolvedValue(createdUser);

    const result = await controller.createUser(data);

    expect(result).toEqual(createdUser);
    expect(mockUsersService.createUserAccount).toHaveBeenCalledWith(data);
  });

  it('should update user', async () => {
    const data = {
      firstName: 'Dema',
      address: 'Tel Aviv',
    };

    const updatedUser = {
      id: 1,
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
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
      firstName: 'Dema',
      lastName: 'Saed',
      email: 'dema@example.com',
      address: 'Haifa',
    };

    mockUsersService.deleteUser.mockResolvedValue(deletedUser);

    const result = await controller.deleteUser(1);

    expect(result).toEqual(deletedUser);
    expect(mockUsersService.deleteUser).toHaveBeenCalledWith(1);
  });
});
