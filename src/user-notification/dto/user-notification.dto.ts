import { OmitType } from '@nestjs/swagger';
import { UserNotification } from '../entity/user-notification.entity';

export class UserNotificationDto extends OmitType(UserNotification, [
  'user',
  'notification',
]) {}
