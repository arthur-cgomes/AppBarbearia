import { ApiProperty } from '@nestjs/swagger';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';

export class UpdateBarberDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  barbershop: BarberShop;
  //VERIFICAR SE O BARBER VAI PODER ALTERAR ONDE ATUA
}