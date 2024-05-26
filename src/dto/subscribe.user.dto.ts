import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: Number, isArray: true, required: true })
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  workShops: number[];
}
