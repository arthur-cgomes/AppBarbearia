import { BarberShopController } from './barber-shop.controller';
import { BarberShopService } from './barber-shop.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [BarberShopController],
  providers: [BarberShopService],
})
export class BarberShopModule {}
