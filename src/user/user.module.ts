import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import UserService from './user.service';
import { Workshop } from 'src/workshop/entities/workShop.entity';
import { UserController } from './user.controller';
import { CreateUserDto } from './dto/create.user.dto';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Workshop])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
