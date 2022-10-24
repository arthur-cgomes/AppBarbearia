import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  read: boolean;
}
