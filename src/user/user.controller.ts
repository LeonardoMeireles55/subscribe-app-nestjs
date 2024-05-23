import { Controller, Get, Patch, Post } from '@nestjs/common';
import UserService from './user.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(createUser: CreateUserDto) {
    try {
      await this.userService.createUser(createUser);
      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @Get()
  async findAll() {
    try {
      const users = await this.userService.getAllUsers();
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  @Get(':id')
  async findOne(id: number) {
    try {
      const user = await this.userService.getUserById(id);
      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
  @Patch(':id')
  async update(id: number, updateUser: CreateUserDto) {
    try {
      await this.userService.updateUser(id, updateUser);
      return {
        success: true,
        message: 'User Updated Successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
