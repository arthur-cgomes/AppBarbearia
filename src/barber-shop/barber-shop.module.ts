import { BarberShopController } from './barber-shop.controller';
import { BarberShopService } from './barber-shop.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShop } from './entity/barber-shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BarberShop])],
  controllers: [BarberShopController],
  providers: [BarberShopService],
})
export class BarberShopModule {}
