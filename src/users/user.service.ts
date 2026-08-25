import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  // Internal, low-level insert. Called by AuthService.signup with a
  // fully-prepared object (email/phone already checked for uniqueness,
  // password already hashed) -- so it must NOT re-validate anything,
  // otherwise it can reject data that is already correct (this used to
  // check `data.name` / `data.password`, fields that don't even exist
  // on this object, so every real signup failed with a 400).
  async createUser(data: Prisma.UserCreateInput) {
    return this.userDao.createUser(data);
  }

  // Used by POST /users. Unlike createUser() above, this receives a raw
  // plaintext password from the client, so it must do the same checks
  // signup does: normalize + check uniqueness, then hash the password
  // before it ever reaches the database.
  async createUserAccount(dto: CreateUserDto) {
    const email = dto.email.trim().toLowerCase();
    const phone = dto.phone?.trim();

    const existingUser = await this.userDao.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    if (phone) {
      const existingPhone = await this.userDao.findUserByPhone(phone);

      if (existingPhone) {
        throw new ConflictException('Phone number is already registered');
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.createUser({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email,
      phone: phone ?? null,
      passwordHash,
      isTFAEnabled: dto.isTFAEnabled ?? false,
      address: dto.address?.trim() || null,
    });
  }

  async updateUser(id: number, data: UpdateUserDto) {
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
  findUserByPhone(phone: string) {
    return this.userDao.findUserByPhone(phone);
  }

}