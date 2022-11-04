import { BarberShopModule } from './barber-shop/barber-shop.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ormConfig } from './ormconfig';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserTypeModule } from './user-type/user-type.module';
import { NotificationModule } from './notification/notification.module';
import { UserNotificationModule } from './user-notification/user-notification.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    UserModule,
    AuthModule,
    UserTypeModule,
    NotificationModule,
    UserNotificationModule,
    BarberShopModule, 
  ],
})
export class AppModule {}

