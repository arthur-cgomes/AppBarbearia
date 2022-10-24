import { Module } from '@nestjs/common';
import { UserNotificationService } from './user-notification.service';
import { UserNotificationController } from './user-notification.controller';
import { UserNotification } from './entity/user-notification.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotification]), UserModule],
  providers: [UserNotificationService],
  controllers: [UserNotificationController],
  exports: [UserNotificationService],
})
export class UserNotificationModule {}
