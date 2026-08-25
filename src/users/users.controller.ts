import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';

// Every route here needs a valid login -- there is no reason a stranger
// should be able to list every user or delete someone's account.
@UseGuards(JwtAuthGuard)
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
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUserAccount(data);
  }

  // This updates an existing user
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, data);
  }

  // This deletes a user
  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
