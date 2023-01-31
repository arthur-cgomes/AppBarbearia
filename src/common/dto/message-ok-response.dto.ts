import { ApiProperty } from '@nestjs/swagger';

export class OkResponseDto {
  @ApiProperty({ example: 'Ok' })
  message: string;
}
