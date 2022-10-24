import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserUserTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
