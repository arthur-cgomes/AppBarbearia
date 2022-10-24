import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty()
  @IsOptional()
  externalId: string;

  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  message: string;
}
