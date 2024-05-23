import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create.user.dto';
import { IsNumber } from 'class-validator';
import { Workshop } from 'src/workshop/entities/workShop.entity';

export class SubscribeUserDto extends PartialType(CreateUserDto) {
  @IsNumber({}, { each: true })
  workShops: Workshop[];
}
