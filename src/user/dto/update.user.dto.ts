import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Workshop } from 'src/workshop/entities/workShop.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  workShops?: Workshop[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
