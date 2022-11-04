import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBarberShopDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;
}
