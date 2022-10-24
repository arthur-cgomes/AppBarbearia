import { ApiProperty } from '@nestjs/swagger';
import { UserNotification } from '../entity/user-notification.entity';
import { UserNotificationDto } from './user-notification.dto';

export class GetAllUserNotificationsResponseDto {
  @ApiProperty()
  total: number;

  @ApiProperty()
  skip: number;

  @ApiProperty({ type: UserNotificationDto, isArray: true })
  usernotifications: UserNotification[];
}