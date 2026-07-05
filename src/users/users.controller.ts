import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // This returns all users
  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // This returns one user by id
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUserById(id);
  }

  // This creates a new user
  @Post()
  createUser(@Body() data: any) {
    return this.usersService.createUser(data);
  }

  // This updates an existing user
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: any,
  ) {
    return this.usersService.updateUser(id, data);
  }

  // This deletes a user
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}