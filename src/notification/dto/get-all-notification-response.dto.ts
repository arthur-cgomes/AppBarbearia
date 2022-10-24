import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '../../notification/entity/notification.entity';
import { NotificationDto } from './notification.dto';

export class GetAllNotificationsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: NotificationDto, isArray: true })
  notification: Notification[];
}
