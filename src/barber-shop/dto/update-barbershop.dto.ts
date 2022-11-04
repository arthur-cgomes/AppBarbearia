import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateBarberShopDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
