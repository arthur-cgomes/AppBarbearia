import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Column, OneToOne } from 'typeorm';
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
  @OneToOne(() => BarberShop, (barbershop) => barbershop.barber)
  barbershop: BarberShop;
}
