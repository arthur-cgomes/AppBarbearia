import { BarberShopModule } from './barber-shop/barber-shop.module';
import { Module } from '@nestjs/common';
import { ormConfig } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [BarberShopModule, TypeOrmModule.forRoot(ormConfig)],
})
export class AppModule {}
