import { BarberShopModule } from './barber-shop/barber-shop.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ormConfig } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    BarberShopModule, 
  ],
})
export class AppModule {}
