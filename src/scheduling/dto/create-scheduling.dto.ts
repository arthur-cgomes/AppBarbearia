import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSchedulingDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string;

  @ApiProperty()
  @IsNotEmpty()
  barberShopId: string;

  @ApiProperty()
  @IsNotEmpty()
  serviceId: string;

  @ApiProperty()
  @IsNotEmpty()
  date: Date;
}
