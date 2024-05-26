import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateWorkshopDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    capacity: number;

    @ApiProperty()
    @IsDateString() // Use IsDateString instead of IsDate
    startDate: Date;

    @ApiProperty()
    @IsDateString() // Use IsDateString instead of IsDate
    endDate: Date;
}
