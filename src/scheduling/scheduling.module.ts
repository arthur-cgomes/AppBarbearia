import { Module } from '@nestjs/common';
import { SchedulingService } from './scheduling.service';
import { SchedulingController } from './scheduling.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scheduling } from './entity/scheduling.entity';
import { UserModule } from '../user/user.module';
import { BarberShopModule } from '../barber-shop/barber-shop.module';
import { ServicesModule } from '../service/service.module';
import { BarberModule } from 'src/barber/barber.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scheduling]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    UserModule,
    BarberShopModule,
    BarberModule,
    ServicesModule,
  ],
  controllers: [SchedulingController],
  providers: [SchedulingService],
  exports: [SchedulingService],
})
export class SchedulingModule {}
