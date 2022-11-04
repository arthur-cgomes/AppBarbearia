import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({ example: 'removed' })
  message: string;
}
