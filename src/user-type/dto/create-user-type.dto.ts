import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
