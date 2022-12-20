import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';

export class CreateBarberDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  barbershop: BarberShop;
}
