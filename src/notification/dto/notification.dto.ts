import { OmitType } from '@nestjs/swagger';
import { Notification } from '../../notification/entity/notification.entity';

export class NotificationDto extends OmitType(Notification, ['user']) {}
