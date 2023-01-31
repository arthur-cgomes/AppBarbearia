import { OmitType } from '@nestjs/swagger';
import { BarberShop } from '../entity/barber-shop.entity';

export class BarberShopDto extends OmitType(BarberShop, [
  'user',
  'scheduling',
  'barber',
]) {}
