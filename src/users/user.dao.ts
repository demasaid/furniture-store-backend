import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class UserDao extends PrismaClient {
  getAllUsers() {
    return this.user.findMany();
  }

  getUserById(id: number) {
    return this.user.findUnique({
      where: { id },
    });
  }

  createUser(data: any) {
    return this.user.create({
      data,
    });
  }

  updateUser(id: number, data: any) {
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
}