import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BarberShop } from '../../barber-shop/entity/barber-shop.entity';

export class UpdateBarberDto {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @IsOptional()
  barbershop: BarberShop;
}
