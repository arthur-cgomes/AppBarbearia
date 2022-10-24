import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  message: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  toUsersIds: string[];
}
