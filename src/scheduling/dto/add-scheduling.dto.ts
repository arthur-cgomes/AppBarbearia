import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class AddSchedulingDto {
    @ApiProperty()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsNotEmpty()
    barberShopId: string;

    @ApiProperty()
    @IsNotEmpty()
    serviceId: string;

}