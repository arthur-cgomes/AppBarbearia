import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from './entity/scheduling.entity';
import { UserModule } from 'src/user/user.module';
import { BarberShopModule } from 'src/barber-shop/barber-shop.module';
import { ServicesModule } from 'src/services/services.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scheduling]),
    UserModule,
    BarberShopModule,
    ServicesModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
