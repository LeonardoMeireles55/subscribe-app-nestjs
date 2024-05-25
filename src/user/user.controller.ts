import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import UserService from './user.service';
import { CreateUserDto } from './dto/create.user.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubscribeUserDto } from './dto/subscribe.user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('subscribe')
  async subscribeUser(@Body() body: SubscribeUserDto) {
    try {
      const user = await this.userService.subscribeUser(
        body.id,
        body.workShops,
      );
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

  @Post('signup')
  @ApiBody({ description: 'signup', type: CreateUserDto })
  async create(@Body() createUser: CreateUserDto) {
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

  @Get('getAllUsers')
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
  @ApiParam({ name: 'id', type: Number })
  async findOneById(@Param('id', ParseIntPipe) id: number) {
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
  async update(@Body() id: number, updateUser: CreateUserDto) {
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
