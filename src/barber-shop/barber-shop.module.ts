import { BarberShopController } from './barber-shop.controller';
import { BarberShopService } from './barber-shop.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BarberShop } from './entity/barber-shop.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([BarberShop]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [BarberShopController],
  providers: [BarberShopService],
  exports: [BarberShopService],
})
export class BarberShopModule {}
