import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import UserService from './user.service';
import { CreateUserDto } from '../dto/create.user.dto';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubscribeUserDto } from '../dto/subscribe.user.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('subscribeList')
  @HttpCode(200)
  async getSuscribedWorkshops(@Query('id', ParseIntPipe) idUser: number) {
    try {
      const user = this.userService.getSuscribedWorkshops(idUser);
      return user;
    } catch {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  @Post('subscribe')
  @HttpCode(200)
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
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('signup')
  @HttpCode(201)
  @ApiBody({ description: 'signup', type: CreateUserDto })
  async create(@Body() createUser: CreateUserDto) {
    try {
      await this.userService.createUser(createUser);
      return {
        success: true,
        message: 'User Created Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('getAllUsers')
  @HttpCode(200)
  async findAll() {
    try {
      const users = await this.userService.getAllUsers();
      return {
        success: true,
        data: users,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
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
      throw new HttpException(error.message, error.status);
    }
  }
  @Patch(':id')
  @HttpCode(200)
  @ApiParam({ name: 'id', type: Number })
  async update(@Body() id: number, updateUser: CreateUserDto) {
    try {
      await this.userService.updateUser(id, updateUser);
      return {
        success: true,
        message: 'User Updated Successfully',
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
