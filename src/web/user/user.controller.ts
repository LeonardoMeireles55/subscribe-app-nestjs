import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import UserService from './user.service';
import { CreateUserDto } from '../../dto/create.user.dto';
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubscribeUserDto } from '../../dto/subscribe.user.dto';
import { Public } from 'src/web/auth/constants/isPublic.decorator';
import { Roles } from '../auth/constants/roles.decorator';
import { Role } from '../auth/constants/roles.enum';
import { RolesGuard } from '../auth/guards/role.guard';
import { ChangePasswordUserDto } from 'src/dto/changePassword.user.dto';

@ApiTags('User')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('subscribeList')
  @Roles(Role.User, Role.Admin)
  @HttpCode(200)
  async getSuscribedWorkshops(@Query('id', ParseIntPipe) idUser: number) {
    try {
      const user = this.userService.getSuscribedWorkshops(idUser);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Post('subscribe')
  @Roles(Role.User, Role.Admin)
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
  @Public()
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

  @Post('changePassword')
  @Roles(Role.User, Role.Admin)
  @ApiBody({ description: 'changePassword', type: ChangePasswordUserDto })
  @HttpCode(200)
  async changePassword(@Body() ChangePasswordUserDto)
    : Promise<String> {
    try {
      await this.userService
        .changePassword(ChangePasswordUserDto.id, ChangePasswordUserDto.oldPassword,
          ChangePasswordUserDto.newPassword);
      return "Password Changed Successfull"

    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('getAllUsers')
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
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
  @HttpCode(200)
  @Roles(Role.Admin)
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
