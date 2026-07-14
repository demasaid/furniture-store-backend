import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserDao } from './user.dao';

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UserDao) {}

  
  async getAllUsers() {
    return this.userDao.getAllUsers();
  }

  async getUserById(id: number) {
    const user = await this.userDao.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
   // Used internally during TFA verification.
  async findAuthUserById(id: number) {
    return this.userDao.getAuthUserById(id);
  }

  // Used during signup and signin.
  async findUserByEmail(email: string) {
    return this.userDao.getUserByEmail(email);
  }

  async createUser(data: any) {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Name, email, and password are required');
    }

    return this.userDao.createUser(data);
  }

  async updateUser(id: number, data: any) {
    const user = await this.userDao.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userDao.updateUser(id, data);
  }

  async deleteUser(id: number) {
    const user = await this.userDao.getUserById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userDao.deleteUser(id);
  }

}