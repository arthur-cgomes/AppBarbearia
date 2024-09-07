import { Module } from '@nestjs/common';
import { ServicesService } from './service.service';
import { ServicesController } from './service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entity/service.entity';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([Service]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
  exports: [ServicesService],
})
export class ServicesModule {}
