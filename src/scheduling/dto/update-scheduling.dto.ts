import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateSchedulingDto {
    @ApiProperty()
    @IsOptional()
    barberShopId: string;

    @ApiProperty()
    @IsOptional()
    serviceId: string;
}