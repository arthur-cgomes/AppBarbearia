import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification } from './entity/notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { UserNotificationModule } from '../user-notification/user-notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    UserModule,
    UserNotificationModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
