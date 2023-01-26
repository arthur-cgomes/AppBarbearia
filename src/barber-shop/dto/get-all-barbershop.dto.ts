import { ApiProperty } from '@nestjs/swagger';
import { BarberShop } from '../entity/barber-shop.entity';

export class GetAllBarberShopResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: BarberShop, isArray: true })
  barbershops: BarberShop[];
}
