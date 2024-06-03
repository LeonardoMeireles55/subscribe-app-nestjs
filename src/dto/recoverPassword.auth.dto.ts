import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class RecoverPasswordDto {
    @ApiProperty()
    @IsEmail()
    email: string;
}