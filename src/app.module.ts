import { BarberShopModule } from './barber-shop/barber-shop.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ServicesModule } from './service/service.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { BarberModule } from './barber/barber.module';

config();

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('TYPEORM_HOST'),
        port: configService.get('TYPEORM_PORT'),
        username: configService.get('TYPEORM_USERNAME'),
        password: configService.get('TYPEORM_PASSWORD'),
        database: configService.get('TYPEORM_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    UserModule,
    AuthModule,
    BarberShopModule,
    ServicesModule,
    SchedulingModule,
    BarberModule,
  ],
})
export class AppModule {}
