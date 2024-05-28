import { PartialType } from "@nestjs/swagger";
import { CreateWorkshopDto } from "./create.workshop.dto";

export class PartialWorkshopDto extends PartialType(CreateWorkshopDto) {
    name: string;
    description: string;
    capacity: number;
    startDate: Date;
    endDate: Date;
}