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
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ type: Number, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  workShops?: number[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
