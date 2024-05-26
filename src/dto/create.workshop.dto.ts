import { ApiProperty } from "@nestjs/swagger";

export class CreateWorkshopDto {
    @ApiProperty()
    name: string;
    description: string;
    capacity: number;
    startDate: Date;
    endDate: Date;
}