import {
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
} from 'class-validator';
import { Workshop } from 'src/workshop/entities/workShop.entity';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  workShops?: Workshop[];
}
