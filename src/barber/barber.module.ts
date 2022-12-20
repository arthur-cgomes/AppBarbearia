import { Module } from '@nestjs/common';
import { BarberService } from './barber.service';
import { BarberController } from './barber.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Barber } from './entity/barber.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Barber])],
  providers: [BarberService],
  controllers: [BarberController]
})
export class BarberModule {}
