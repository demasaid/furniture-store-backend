import { Injectable } from '@nestjs/common';
import {
  Prisma,
  PrismaClient,
} from '@prisma/client';

@Injectable()
export class UserDao extends PrismaClient {
  getAllUsers() {
    return this.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isTFAEnabled: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Safe version used by normal Users endpoints.
  getUserById(id: number) {
    return this.user.findUnique({
      where: { id },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        isTFAEnabled: true,
        address: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Internal version used by AuthService.
  // It includes authentication fields.
  getAuthUserById(id: number) {
    return this.user.findUnique({
      where: { id },
    });
  }

  getUserByEmail(email: string) {
    return this.user.findUnique({
      where: { email },
    });
  }

  getUserByPhone(phone: string) {
    return this.user.findUnique({
      where: { phone },
    });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.user.create({
      data,
    });
  }

  updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
  ) {
    return this.user.update({
      where: { id },
      data,
    });
  }

  deleteUser(id: number) {
    return this.user.delete({
      where: { id },
    });
  }
  
  findUserByPhone(phone: string) {
    return this.user.findUnique({
      where: { phone },
    });
}
}