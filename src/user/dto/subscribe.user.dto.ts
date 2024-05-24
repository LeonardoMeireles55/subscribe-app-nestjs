import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SubscribeUserDto extends PartialType(CreateUserDto) {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ type: Number, isArray: true })
  @IsNumber({}, { each: true })
  workShops: number[];
}
